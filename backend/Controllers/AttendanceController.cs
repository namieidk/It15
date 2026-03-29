using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using YourProject.Data;
using YourProject.Hubs;
using YourProject.Models;
using System.Text.Json;

namespace YourProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AttendanceController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IHubContext<AttendanceHub> _hub;
        private readonly TimeZoneInfo _phZone = TimeZoneInfo.FindSystemTimeZoneById("Singapore Standard Time");

        public AttendanceController(ApplicationDbContext context, IHubContext<AttendanceHub> hub)
        {
            _context = context;
            _hub = hub;
        }

        // --- NEW: HR GLOBAL ATTENDANCE ---
        // GET: api/Attendance/all
        [HttpGet("all")]
        public async Task<IActionResult> GetAllAttendance()
        {
            try
            {
                DateTime phNow = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, _phZone);
                DateTime today = phNow.Date;

                var records = await _context.Attendance
                    .Where(a => a.ClockInTime >= today)
                    .OrderByDescending(a => a.ClockInTime)
                    .ToListAsync();

                var uiData = records.Select(r => new {
                    id = r.EmployeeId,
                    name = r.Name?.ToUpper() ?? "UNKNOWN",
                    dept = r.Department?.ToUpper() ?? "N/A", // Added for HR Table
                    shift = "SCHEDULED",
                    login = r.ClockInTime.HasValue ? r.ClockInTime.Value.ToString("HH:mm") : "--:--",
                    status = r.Status?.ToUpper() ?? "PRESENT",
                    health = r.Status == "LATE" ? "WARNING" : "GOOD"
                });

                return Ok(uiData);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching global logs", error = ex.Message });
            }
        }

        // GET: api/Attendance/department/{department}
        [HttpGet("department/{department}")]
        public async Task<IActionResult> GetDepartmentAttendance(string department)
        {
            try
            {
                DateTime phNow = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, _phZone);
                DateTime today = phNow.Date;

                var records = await _context.Attendance
                    .Where(a => a.Department == department && a.ClockInTime >= today)
                    .OrderByDescending(a => a.ClockInTime)
                    .ToListAsync();

                var uiData = records.Select(r => new {
                    id = r.EmployeeId,
                    name = r.Name?.ToUpper() ?? "UNKNOWN",
                    dept = r.Department?.ToUpper() ?? "N/A",
                    shift = "SCHEDULED",
                    login = r.ClockInTime.HasValue ? r.ClockInTime.Value.ToString("HH:mm") : "--:--",
                    status = r.Status?.ToUpper() ?? "PRESENT",
                    health = r.Status == "LATE" ? "WARNING" : "GOOD"
                });

                return Ok(uiData);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching department logs", error = ex.Message });
            }
        }

        [HttpPost("clockin")]
        public async Task<IActionResult> ClockIn([FromBody] Attendance model)
        {
            try
            {
                DateTime phNow = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, _phZone);

                var user = await _context.Users.FirstOrDefaultAsync(u => u.EmployeeId == model.EmployeeId);
                var schedule = await _context.Schedules.FirstOrDefaultAsync(s => s.EmployeeId == model.EmployeeId && s.IsActive);

                if (user == null || schedule == null)
                    return BadRequest(new { message = "User Profile or Schedule not found." });

                model.Name = user.Name;
                model.Role = user.Role;
                model.Department = user.Department;
                model.ClockInTime = phNow;
                model.Status = (phNow.TimeOfDay > schedule.ShiftStart) ? "LATE" : "PRESENT";

                _context.Attendance.Add(model);
                await _context.SaveChangesAsync();

                // --- UPDATED SIGNALR BROADCAST ---
                var newRecord = new {
                    id = model.EmployeeId,
                    name = model.Name?.ToUpper() ?? "UNKNOWN",
                    dept = model.Department?.ToUpper() ?? "N/A",
                    shift = "SCHEDULED",
                    login = phNow.ToString("HH:mm"),
                    status = model.Status?.ToUpper() ?? "PRESENT",
                    health = model.Status == "LATE" ? "WARNING" : "GOOD"
                };

                // 1. Broadcast to Department Group (For Managers)
                await _hub.Clients.Group(model.Department ?? "GENERAL")
                    .SendAsync("NewClockIn", newRecord);

                // 2. Broadcast to "HR_GLOBAL" Group (For HR Dashboard)
                await _hub.Clients.Group("HR_GLOBAL")
                    .SendAsync("NewClockIn", newRecord);

                if (model.Status == "LATE")
                {
                    var lateAlert = new {
                        employeeId = model.EmployeeId,
                        name = model.Name?.ToUpper(),
                        time = phNow.ToString("HH:mm"),
                        dept = model.Department?.ToUpper()
                    };

                    await _hub.Clients.Group(model.Department ?? "GENERAL").SendAsync("LateNotification", lateAlert);
                    await _hub.Clients.Group("HR_GLOBAL").SendAsync("LateNotification", lateAlert);
                }

                return Ok(new { message = "Clock In Success", status = model.Status });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server Error", error = ex.Message });
            }
        }

        [HttpPost("clockout")]
        public async Task<IActionResult> ClockOut([FromBody] JsonElement body)
        {
            try
            {
                string empId = body.GetProperty("employeeId").GetString() ?? "";
                var record = await _context.Attendance
                    .Where(a => a.EmployeeId == empId && a.ClockOutTime == null)
                    .OrderByDescending(a => a.ClockInTime)
                    .FirstOrDefaultAsync();

                if (record == null) return NotFound(new { message = "No active shift found." });

                DateTime phNow = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, _phZone);
                record.ClockOutTime = phNow;
                
                double workHrs = (record.ClockOutTime.Value - record.ClockInTime!.Value).TotalHours - 1;
                record.TotalHoursWorked = Math.Max(0, Math.Round(workHrs, 2));
                record.RegularHours = Math.Min(8, record.TotalHoursWorked);
                record.OvertimeHours = Math.Max(0, record.TotalHoursWorked - 8);

                await _context.SaveChangesAsync();
                return Ok(new { message = "Clock Out Success" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Clock out failed.", error = ex.Message });
            }
        }

        [HttpGet("my-logs/{employeeId}")]
        public async Task<IActionResult> GetMyLogs(string employeeId)
        {
            var logs = await _context.Attendance
                .Where(a => a.EmployeeId == employeeId)
                .OrderByDescending(a => a.ClockInTime)
                .ToListAsync();
            return Ok(logs);
        }
    }
}
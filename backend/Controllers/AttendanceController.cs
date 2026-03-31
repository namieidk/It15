using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using YourProject.Data;
using YourProject.Hubs;
using YourProject.Models;
using YourProject.Services;
using System.Text.Json;

namespace YourProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AttendanceController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IHubContext<AttendanceHub> _hub;
        private readonly ReportService _reports;
        private readonly TimeZoneInfo _phZone =
            TimeZoneInfo.FindSystemTimeZoneById("Singapore Standard Time");

        public AttendanceController(
            ApplicationDbContext context,
            IHubContext<AttendanceHub> hub,
            ReportService reports)
        {
            _context = context;
            _hub = hub;
            _reports = reports;
        }

        // --- NEW: WEEKLY SUMMARY ENDPOINT (Fixes 404 Error) ---
        [HttpGet("weekly-summary/{employeeId}")]
        public async Task<IActionResult> GetWeeklySummary(string employeeId)
        {
            try
            {
                DateTime phNow = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, _phZone);
                
                // Calculate start of current week (Monday)
                int diff = (7 + (phNow.Date.DayOfWeek - DayOfWeek.Monday)) % 7;
                DateTime startOfWeek = phNow.Date.AddDays(-1 * diff);
                DateTime endOfWeek = startOfWeek.AddDays(7);

                var weeklyRecords = await _context.Attendance
                    .Where(a => a.EmployeeId == employeeId && 
                                a.ClockInTime >= startOfWeek && 
                                a.ClockInTime < endOfWeek)
                    .ToListAsync();

                return Ok(new
                {
                    employeeId = employeeId,
                    totalRegular = Math.Round(weeklyRecords.Sum(r => r.RegularHours), 2),
                    totalOT = Math.Round(weeklyRecords.Sum(r => r.OvertimeHours), 2),
                    daysWorked = weeklyRecords.Count
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "ERROR CALCULATING WEEKLY STATS", error = ex.Message });
            }
        }

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
                    id     = r.EmployeeId,
                    name   = r.Name?.ToUpper()       ?? "UNKNOWN",
                    dept   = r.Department?.ToUpper() ?? "N/A",
                    shift  = "SCHEDULED",
                    login  = r.ClockInTime.HasValue ? r.ClockInTime.Value.ToString("HH:mm") : "--:--",
                    status = r.Status?.ToUpper()     ?? "PRESENT",
                    health = r.Status == "LATE" ? "WARNING" : "GOOD"
                });

                return Ok(uiData);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching global logs", error = ex.Message });
            }
        }

        [HttpPost("clockin")]
        public async Task<IActionResult> ClockIn([FromBody] Attendance model)
        {
            try
            {
                DateTime phNow = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, _phZone);
                TimeSpan currentTime = phNow.TimeOfDay;

                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.EmployeeId == model.EmployeeId);
                var schedule = await _context.Schedules
                    .FirstOrDefaultAsync(s => s.EmployeeId == model.EmployeeId && s.IsActive);

                if (user == null || schedule == null)
                    return BadRequest(new { message = "User Profile or Schedule not found." });

                // Early Clock-in Restriction (30 mins)
                TimeSpan buffer = TimeSpan.FromMinutes(30);
                TimeSpan earliestAllowed = schedule.ShiftStart.Subtract(buffer);

                if (currentTime < schedule.ShiftStart && currentTime < earliestAllowed)
                {
                    return BadRequest(new { 
                        message = $"TOO EARLY. SHIFT STARTS AT {schedule.ShiftStart:hh\\:mm}. CLOCK-IN ALLOWED FROM {earliestAllowed:hh\\:mm}." 
                    });
                }

                model.Name        = user.Name;
                model.Role        = user.Role;
                model.Department  = user.Department;
                model.ClockInTime = phNow;
                model.Status      = (currentTime > schedule.ShiftStart) ? "LATE" : "PRESENT";

                _context.Attendance.Add(model);
                await _context.SaveChangesAsync();

                var newRecord = new {
                    id     = model.EmployeeId,
                    name   = model.Name?.ToUpper()       ?? "UNKNOWN",
                    dept   = model.Department?.ToUpper() ?? "N/A",
                    shift  = "SCHEDULED",
                    login  = phNow.ToString("HH:mm"),
                    status = model.Status?.ToUpper()     ?? "PRESENT",
                    health = model.Status == "LATE" ? "WARNING" : "GOOD"
                };

                await _hub.Clients.Group(model.Department ?? "GENERAL").SendAsync("NewClockIn", newRecord);
                await _hub.Clients.Group("HR_GLOBAL").SendAsync("NewClockIn", newRecord);

                return Ok(new { message = "CLOCK-IN SUCCESSFUL", status = model.Status });
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
                string empId  = body.GetProperty("employeeId").GetString() ?? "";
                var    record = await _context.Attendance
                    .Where(a => a.EmployeeId == empId && a.ClockOutTime == null)
                    .OrderByDescending(a => a.ClockInTime)
                    .FirstOrDefaultAsync();

                if (record == null)
                    return NotFound(new { message = "NO ACTIVE SHIFT FOUND." });

                DateTime phNow = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, _phZone);
                record.ClockOutTime = phNow;

                // Calculation logic (subtracting 1 hour for break)
                double workHrs = (record.ClockOutTime.Value - record.ClockInTime!.Value).TotalHours - 1;
                record.TotalHoursWorked = Math.Max(0, Math.Round(workHrs, 2));
                record.RegularHours     = Math.Min(8, record.TotalHoursWorked);
                record.OvertimeHours    = Math.Max(0, record.TotalHoursWorked - 8);

                await _context.SaveChangesAsync();

                // Trigger Report Service
                var user = await _context.Users.FirstOrDefaultAsync(u => u.EmployeeId == empId);
                if (user != null)
                {
                    await _reports.CreateAttendanceReportAsync(
                        employeeId:       empId,
                        department:       user.Department,
                        attendanceStatus: record.Status ?? "PRESENT",
                        date:             record.ClockInTime.Value.Date,
                        hoursWorked:      record.TotalHoursWorked
                    );
                }

                return Ok(new { message = "CLOCK-OUT SUCCESSFUL" });
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
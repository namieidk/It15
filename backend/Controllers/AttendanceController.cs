using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using YourProject.Data; // Change to your actual namespace
using YourProject.Models;
using System.Text.Json;

namespace YourProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AttendanceController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AttendanceController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("weekly-summary/{employeeId}")]
        public async Task<IActionResult> GetWeeklySummary(string EmployeeId)
        {
            try
            {
                var phZone = TimeZoneInfo.FindSystemTimeZoneById("Singapore Standard Time");
                DateTime phNow = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, phZone);
                
                // Get start of week (Monday)
                int diff = (7 + (phNow.Date.DayOfWeek - DayOfWeek.Monday)) % 7;
                DateTime startOfWeek = phNow.Date.AddDays(-1 * diff);

                var weeklyRecords = await _context.Attendance
                    .Where(a => a.EmployeeId == EmployeeId && a.ClockInTime >= startOfWeek)
                    .ToListAsync();

                return Ok(new {
                    totalRegular = Math.Round(weeklyRecords.Sum(r => r.RegularHours), 2),
                    totalOT = Math.Round(weeklyRecords.Sum(r => r.OvertimeHours), 2),
                    daysWorked = weeklyRecords.Count
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error calculating summary", details = ex.Message });
            }
        }

        [HttpPost("clockin")]
        public async Task<IActionResult> ClockIn([FromBody] Attendance model)
        {
            try {
                var phZone = TimeZoneInfo.FindSystemTimeZoneById("Singapore Standard Time");
                DateTime phNow = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, phZone);
                
                var user = await _context.Users.FirstOrDefaultAsync(u => u.EmployeeId == model.EmployeeId);
                var schedule = await _context.Schedules.FirstOrDefaultAsync(s => s.EmployeeId == model.EmployeeId && s.IsActive);

                if (user == null || schedule == null)
                    return BadRequest(new { message = "User Profile or Schedule not found." });

                // Map User Data to Attendance
                model.Name = user.Name;
                model.Role = user.Role;
                model.Department = user.Department;
                model.ClockInTime = phNow;
                model.Status = (phNow.TimeOfDay > schedule.ShiftStart) ? "LATE" : "PRESENT";

                _context.Attendance.Add(model);
                await _context.SaveChangesAsync();
                return Ok(new { message = "Clock In Success", status = model.Status });
            } catch (Exception ex) {
                return StatusCode(500, new { message = "Internal Server Error", error = ex.Message });
            }
        }

        [HttpPost("clockout")]
        public async Task<IActionResult> ClockOut([FromBody] JsonElement body)
        {
            try {
                string empId = body.GetProperty("employeeId").GetString();
                var record = await _context.Attendance
                    .Where(a => a.EmployeeId == empId && a.ClockOutTime == null)
                    .OrderByDescending(a => a.ClockInTime)
                    .FirstOrDefaultAsync();

                if (record == null) return NotFound(new { message = "No active shift." });

                var phZone = TimeZoneInfo.FindSystemTimeZoneById("Singapore Standard Time");
                DateTime phNow = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, phZone);
                
                record.ClockOutTime = phNow;
                double workHrs = (record.ClockOutTime.Value - record.ClockInTime.Value).TotalHours - 1; // 1hr break
                
                record.TotalHoursWorked = Math.Max(0, Math.Round(workHrs, 2));
                record.RegularHours = Math.Min(8, record.TotalHoursWorked);
                record.OvertimeHours = Math.Max(0, record.TotalHoursWorked - 8);

                await _context.SaveChangesAsync();
                return Ok(new { message = "Clock Out Success" });
            } catch {
                return StatusCode(500, new { message = "Clock out failed." });
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
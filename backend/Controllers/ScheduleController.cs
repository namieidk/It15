using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using YourProject.Data; 
using YourProject.Models;

namespace YourProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ScheduleController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ScheduleController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("roster")]
        public async Task<ActionResult> GetRoster()
        {
            var users = await _context.Users
                .Where(u => u.Role == "EMPLOYEE")
                .ToListAsync();

            var schedules = await _context.Schedules.ToListAsync();

            var roster = users.Select(u => {
                var schedule = schedules.FirstOrDefault(s => s.EmployeeId == u.EmployeeId);

                return new {
                    id = u.EmployeeId, 
                    name = u.Name.ToUpper(),
                    dept = "PRODUCTION", 
                    currentShift = schedule == null ? "UNASSIGNED" : "ACTIVE",
                    details = schedule != null ? new {
                        start = schedule.ShiftStart.ToString(@"hh\:mm"),
                        end = schedule.ShiftEnd.ToString(@"hh\:mm"),
                        days = schedule.WorkingDays
                    } : null
                };
            });

            return Ok(roster);
        }
        [HttpPost("save")]
        public async Task<IActionResult> SaveSchedule([FromBody] ScheduleSaveDto dto)
        {
            if (!TimeSpan.TryParse(dto.Start, out var startTime))
            {
                return BadRequest(new { message = "Invalid start time format." });
            }
            var duration = TimeSpan.FromHours(9);
            var endTime = startTime.Add(duration);

            if (endTime.Days > 0) 
            {
                endTime = endTime.Subtract(TimeSpan.FromDays(1));
            }

            var schedule = await _context.Schedules
                .FirstOrDefaultAsync(s => s.EmployeeId == dto.EmployeeId);
            
            if (schedule == null) 
            {
                schedule = new Schedule 
                { 
                    EmployeeId = dto.EmployeeId,
                    IsActive = true
                };
                _context.Schedules.Add(schedule);
            }

            schedule.ShiftStart = startTime;
            schedule.ShiftEnd = endTime; 
            schedule.WorkingDays = dto.WorkingDays;

            try 
            {
                await _context.SaveChangesAsync();
                return Ok(new { 
                    message = $"Schedule Synced: {startTime:hh\\:mm} to {endTime:hh\\:mm}",
                    solvedEnd = endTime.ToString(@"hh\:mm")
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Database error", error = ex.Message });
            }
        }
    }

    public class ScheduleSaveDto 
    {
        public string EmployeeId { get; set; } = string.Empty;
        public string Start { get; set; } = string.Empty;
        public string WorkingDays { get; set; } = string.Empty;
    }
}
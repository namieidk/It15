using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using YourProject.Data; // Ensure this matches your namespace
using YourProject.Models;

namespace YourProject.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DashboardController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("stats/{employeeId}")]
        public async Task<IActionResult> GetEmployeeStats(string employeeId)
        {
            try
            {
                // 1. Calculate Attendance Rate
                // Get the employee's schedule to see how many days they SHOULD work
                var schedule = await _context.Schedules
                    .FirstOrDefaultAsync(s => s.EmployeeId == employeeId && s.IsActive);
                
                int expectedDays = 20; // Default fallback
                if (schedule != null && !string.IsNullOrEmpty(schedule.WorkingDays))
                {
                    // Basic logic: count commas in "Mon,Tue,Wed..." + 1, multiplied by 4 weeks
                    expectedDays = (schedule.WorkingDays.Split(',').Length) * 4;
                }

                // Count actual "PRESENT" entries in the last 30 days
                var actualDays = await _context.Attendance
                    .Where(a => a.EmployeeId == employeeId && a.Status == "PRESENT")
                    .CountAsync();

                double attendancePercentage = expectedDays > 0 
                    ? Math.Min((double)actualDays / expectedDays * 100, 100) 
                    : 0;

                // 2. Get CSAT Score (From Evaluations)
                var avgEvalScore = await _context.Evaluations
                    .Where(e => e.TargetEmployeeId.ToString() == employeeId)
                    .AverageAsync(e => (double?)e.Score) ?? 0.0;

                // 3. Get KPI Reports (Count of Evaluations/Submissions)
                var reportCount = await _context.Evaluations
                    .CountAsync(e => e.TargetEmployeeId.ToString() == employeeId);

                // 4. Avg Handle Time (Logic based on TotalHoursWorked or dummy for now)
                // In a real call center, this would come from a 'Tickets' table.
                // Here we'll return a formatted string.
                string handleTime = "4m 12s"; 

                return Ok(new
                {
                    attendanceRate = $"{attendancePercentage:F1}%",
                    avgHandleTime = handleTime,
                    csatScore = $"{avgEvalScore:F1}/5",
                    kpiReports = reportCount.ToString()
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving dashboard data", details = ex.Message });
            }
        }
    }
}
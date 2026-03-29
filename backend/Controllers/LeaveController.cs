using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using YourProject.Data; 
using YourProject.Models; 

namespace YourProjectName.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LeaveController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public LeaveController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Leave/credits/123459
        [HttpGet("credits/{employeeId}")]
        public async Task<IActionResult> GetCredits(int employeeId)
        {
            var employee = await _context.Employee
                .FirstOrDefaultAsync(e => e.EmployeeId == employeeId);
            
            if (employee == null) 
                return NotFound($"Employee {employeeId} not found.");
            
            return Ok(new { balance = employee.LeaveBalance });
        }

        // ✅ NEW: GET: api/Leave/history/123459
        [HttpGet("history/{employeeId}")]
        public async Task<IActionResult> GetHistory(int employeeId)
        {
            var history = await _context.LeaveReq
                .Where(l => l.EmployeeId == employeeId)
                .OrderByDescending(l => l.StartDate)
                .Select(l => new {
                    type = l.LeaveType,
                    date = l.StartDate.ToString("MMM dd, yyyy") + " - " + l.EndDate.ToString("MMM dd, yyyy"),
                    status = l.Status ?? "PENDING"
                })
                .ToListAsync();

            return Ok(history);
        }

        // POST: api/Leave/apply
        [HttpPost("apply")]
        public async Task<IActionResult> ApplyForLeave([FromBody] LeaveRequest request)
        {
            var employee = await _context.Employee
                .FirstOrDefaultAsync(e => e.EmployeeId == request.EmployeeId);
            
            if (employee == null) return NotFound("Employee record missing");

            double requestedDays = (request.EndDate.Date - request.StartDate.Date).TotalDays + 1;

            if (requestedDays <= 0) return BadRequest("Invalid date range");
            if (requestedDays > employee.LeaveBalance) return BadRequest("Insufficient credits");

            _context.LeaveReq.Add(request);
            await _context.SaveChangesAsync();
            
            return Ok(new { message = "Transmitted to system" });
        }
    }
}
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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

        // ==========================================
        // MANAGER ENDPOINTS
        // ==========================================

        // GET: api/Leave/pending
        // Returns only PENDING requests for manager review
        [HttpGet("pending")]
        public async Task<IActionResult> GetPendingRequests()
        {
            try
            {
                var pending = await (from l in _context.LeaveReq
                                     join e in _context.Employee on l.EmployeeId equals e.EmployeeId
                                     where l.Status == "PENDING"
                                     orderby l.DateSubmitted descending
                                     select new {
                                         id = l.Id,
                                         employeeId = l.EmployeeId,
                                         name = e.Name.ToUpper(),
                                         type = l.LeaveType.ToUpper(),
                                         date = l.StartDate.ToString("MMM dd") + " - " + l.EndDate.ToString("MMM dd"),
                                         reason = l.Reason,
                                         priority = l.LeaveType == "SICK LEAVE" ? "HIGH" : "NORMAL"
                                     }).ToListAsync();

                return Ok(pending);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching pending queue", error = ex.Message });
            }
        }

        // POST: api/Leave/manager-action
        // Manager approves → status becomes MANAGER_APPROVED (forwarded to HR)
        // Manager rejects → status becomes REJECTED (stops here, HR never sees it)
        [HttpPost("manager-action")]
        public async Task<IActionResult> ManagerAction([FromBody] LeaveActionModel model)
        {
            try
            {
                var request = await _context.LeaveReq.FindAsync(model.RequestId);
                if (request == null) return NotFound(new { message = "Request not found" });

                if (model.Status == "APPROVED")
                {
                    // Forward to HR — do NOT deduct credits yet
                    request.Status = "MANAGER_APPROVED";
                }
                else
                {
                    // Hard reject — HR will never see this
                    request.Status = "REJECTED";
                }

                await _context.SaveChangesAsync();
                return Ok(new { message = $"Request {model.Status} by manager" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Manager action failed", error = ex.Message });
            }
        }

        // ==========================================
        // HR ENDPOINTS
        // ==========================================

        // GET: api/Leave/hr-pending
        // Returns only MANAGER_APPROVED requests for HR final review
        [HttpGet("hr-pending")]
        public async Task<IActionResult> GetHRPendingRequests()
        {
            try
            {
                var pending = await (from l in _context.LeaveReq
                                     join e in _context.Employee on l.EmployeeId equals e.EmployeeId
                                     where l.Status == "MANAGER_APPROVED"
                                     orderby l.DateSubmitted descending
                                     select new {
                                         id = l.Id,
                                         employeeId = l.EmployeeId,
                                         name = e.Name.ToUpper(),
                                         type = l.LeaveType.ToUpper(),
                                         date = l.StartDate.ToString("MMM dd") + " - " + l.EndDate.ToString("MMM dd"),
                                         reason = l.Reason,
                                         priority = l.LeaveType == "SICK LEAVE" ? "HIGH" : "NORMAL"
                                     }).ToListAsync();

                return Ok(pending);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching HR queue", error = ex.Message });
            }
        }

        // POST: api/Leave/hr-action
        // HR approves → status becomes APPROVED and credits are deducted
        // HR rejects → status becomes REJECTED
        [HttpPost("hr-action")]
        public async Task<IActionResult> HRAction([FromBody] LeaveActionModel model)
        {
            try
            {
                var request = await _context.LeaveReq.FindAsync(model.RequestId);
                if (request == null) return NotFound(new { message = "Request not found" });

                // Safety check — only act on manager-approved requests
                if (request.Status != "MANAGER_APPROVED")
                    return BadRequest(new { message = "Request is not in the HR review queue" });

                var employee = await _context.Employee
                    .FirstOrDefaultAsync(e => e.EmployeeId == request.EmployeeId);

                if (model.Status == "APPROVED")
                {
                    if (employee != null)
                    {
                        // Deduct credits only on final HR approval
                        double requestedDays = (request.EndDate.Date - request.StartDate.Date).TotalDays + 1;
                        employee.LeaveBalance -= (int)requestedDays;
                    }
                    request.Status = "APPROVED";
                }
                else
                {
                    request.Status = "REJECTED";
                }

                await _context.SaveChangesAsync();
                return Ok(new { message = $"Request {model.Status} by HR" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "HR action failed", error = ex.Message });
            }
        }

        // ==========================================
        // EMPLOYEE ENDPOINTS
        // ==========================================

        [HttpGet("credits/{employeeId}")]
        public async Task<IActionResult> GetCredits(int employeeId)
        {
            var employee = await _context.Employee.FirstOrDefaultAsync(e => e.EmployeeId == employeeId);
            if (employee == null) return NotFound($"Employee {employeeId} not found.");
            return Ok(new { balance = employee.LeaveBalance });
        }

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

        [HttpPost("apply")]
        public async Task<IActionResult> ApplyForLeave([FromBody] LeaveRequest request)
        {
            var employee = await _context.Employee.FirstOrDefaultAsync(e => e.EmployeeId == request.EmployeeId);
            if (employee == null) return NotFound("Employee record missing");

            double requestedDays = (request.EndDate.Date - request.StartDate.Date).TotalDays + 1;
            if (requestedDays <= 0) return BadRequest("Invalid date range");

            request.Status = "PENDING";
            request.DateSubmitted = DateTime.Now;

            _context.LeaveReq.Add(request);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Transmitted to system" });
        }
    }

    public class LeaveActionModel
    {
        public int RequestId { get; set; }
        public string Status { get; set; } // "APPROVED" or "REJECTED"
    }
}
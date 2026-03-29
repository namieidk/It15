using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using YourProject.Data;
using YourProject.Models;

namespace YourProject.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EvaluationController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public EvaluationController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("agents")]
        public async Task<IActionResult> GetAgents(
            [FromQuery] string? department,
            [FromQuery] string? excludeId,
            [FromQuery] string viewerRole = "MANAGER")
        {
            try
            {
                var query = _context.Users.AsQueryable();

                // 1. Base Role Filtering
                if (viewerRole.ToUpper() == "HR")
                {
                    // 🛡️ HR Logic: Can see Managers and Employees ONLY.
                    // This automatically hides ADMINS and the HR themselves.
                    query = query.Where(u => u.Role.ToUpper() == "MANAGER" || u.Role.ToUpper() == "EMPLOYEE");
                }
                else
                {
                    // 🛡️ Manager Logic: Can ONLY see Employees.
                    query = query.Where(u => u.Role.ToUpper() == "EMPLOYEE");
                }

                // 2. Department Filtering (Optional for HR, usually required for Managers)
                if (!string.IsNullOrWhiteSpace(department))
                {
                    var deptUpper = department.Trim().ToUpper();
                    query = query.Where(u => u.Department.ToUpper() == deptUpper);
                }

                // 3. Self-Exclusion Safety 
                if (!string.IsNullOrWhiteSpace(excludeId))
                {
                    query = query.Where(u => u.EmployeeId != excludeId.Trim());
                }

                var agents = await query
                    .Select(u => new {
                        id         = u.EmployeeId,
                        name       = u.Name.ToUpper(),
                        role       = u.Role.ToUpper(),
                        department = u.Department.ToUpper(),
                        peerScore  = _context.PeerFeedbacks
                            .Where(f => f.TargetEmployeeId == u.EmployeeId)
                            .Any()
                                ? _context.PeerFeedbacks
                                    .Where(f => f.TargetEmployeeId == u.EmployeeId)
                                    .Average(f => f.Score).ToString("F1")
                                : "0.0"
                    })
                    .ToListAsync();

                return Ok(agents);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching agents", error = ex.Message });
            }
        }

        [HttpGet("peer-results/{employeeId}")]
        public async Task<IActionResult> GetPeerResults(string employeeId)
        {
            try
            {
                var feedback = await _context.PeerFeedbacks
                    .Where(f => f.TargetEmployeeId == employeeId)
                    .Select(f => new {
                        peerId  = f.AnonymousPeerId,
                        score   = f.Score.ToString("F1"),
                        comment = f.Comment
                    })
                    .ToListAsync();

                return Ok(feedback);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpPost("submit")]
        public async Task<IActionResult> SubmitEvaluation([FromBody] EvaluationSubmitModel model)
        {
            try
            {
                var evaluation = new Evaluation
                {
                    TargetEmployeeId = int.Parse(model.TargetEmployeeId),
                    EvaluatorId      = int.Parse(model.EvaluatorId),
                    Score            = model.Score,
                    Comments         = model.Comments ?? "",
                    DateSubmitted    = DateTime.Now
                };

                _context.Evaluations.Add(evaluation);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Evaluation saved successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }

    public class EvaluationSubmitModel
    {
        public string TargetEmployeeId { get; set; } = string.Empty;
        public string EvaluatorId      { get; set; } = string.Empty;
        public double Score            { get; set; }
        public string? Comments        { get; set; }
    }
}
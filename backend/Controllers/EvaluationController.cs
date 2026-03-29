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

        // GET /api/Evaluation/agents?department=ADMINISTRATION&excludeId=123456
        [HttpGet("agents")]
        public async Task<IActionResult> GetAgents(
            [FromQuery] string? department,
            [FromQuery] string? excludeId)
        {
            try
            {
                var query = _context.Users.AsQueryable();

                if (!string.IsNullOrWhiteSpace(department))
                {
                    var deptUpper = department.Trim().ToUpper();
                    query = query.Where(u => u.Department.ToUpper() == deptUpper);
                }

                if (!string.IsNullOrWhiteSpace(excludeId))
                {
                    query = query.Where(u => u.EmployeeId.ToString() != excludeId.Trim());
                }

                // Only show non-manager roles
                query = query.Where(u => u.Role.ToUpper() != "MANAGER");

                var agents = await query
                    .Select(u => new {
                        id         = u.EmployeeId.ToString(),
                        name       = u.Name,
                        role       = u.Role,
                        department = u.Department,
                        peerScore  = _context.PeerFeedbacks
                            .Where(f => f.TargetEmployeeId == u.EmployeeId.ToString())
                            .Any()
                                ? _context.PeerFeedbacks
                                    .Where(f => f.TargetEmployeeId == u.EmployeeId.ToString())
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

        // GET /api/Evaluation/peer-results/{employeeId}
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

        // POST /api/Evaluation/submit
        [HttpPost("submit")]
        public async Task<IActionResult> SubmitEvaluation([FromBody] EvaluationSubmitModel model)
        {
            try
            {
                if (!int.TryParse(model.TargetEmployeeId, out int targetIdInt))
                    return BadRequest(new { message = "Target ID must be numeric." });

                if (!int.TryParse(model.EvaluatorId, out int evaluatorIdInt))
                    return BadRequest(new { message = "Evaluator ID must be numeric." });

                var evaluation = new Evaluation
                {
                    TargetEmployeeId = targetIdInt,
                    EvaluatorId      = evaluatorIdInt,
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
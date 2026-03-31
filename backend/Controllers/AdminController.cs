using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using YourProject.Data;
using YourProject.Models;
using BCrypt.Net;

namespace YourProject.Controllers
{
    [Route("api/admin")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AdminController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ─── 1. FETCH APPROVED APPLICANTS (For Provisioning Dropdown) ──────────
        [HttpGet("approved-applicants")]
        public async Task<IActionResult> GetApprovedApplicants()
        {
            try
            {
                // Fetches only those cleared by HR but not yet given an account
                var approved = await _context.Applicants
                    .Where(a => a.Status == "APPROVED")
                    .Select(a => new {
                        id = a.Id,
                        fullName = (a.FirstName + " " + a.LastName).ToUpper(),
                        email = a.Email,
                        department = a.Department,
                        jobTitle = a.JobTitle
                    })
                    .OrderBy(a => a.fullName)
                    .ToListAsync();

                return Ok(approved);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "FETCH_ERROR", details = ex.Message });
            }
        }

        // ─── 2. PROVISION ACCOUNT ─────────────────────────────────────────────
        [HttpPost("provision")]
        public async Task<IActionResult> ProvisionAccount([FromBody] UserRegistrationDto model)
        {
            if (model == null || string.IsNullOrWhiteSpace(model.EmployeeId))
                return BadRequest(new { message = "ALL FIELDS ARE REQUIRED." });

            var cleanId = model.EmployeeId.Trim().ToUpper();
            var cleanName = model.Name.Trim().ToUpper();

            // Check if Employee ID is already taken in the Users table
            if (await _context.Users.AnyAsync(u => u.EmployeeId == cleanId))
                return BadRequest(new { message = "EMPLOYEE ID ALREADY REGISTERED IN SYSTEM." });

            // Start Transaction: Ensure both User Creation and Applicant Update succeed together
            using var transaction = await _context.Database.BeginTransactionAsync();
            try 
            {
                // Create the System User
                var user = new User {
                    Name         = cleanName,
                    EmployeeId   = cleanId,
                    Role         = model.Role.Trim().ToUpper(),
                    Department   = model.Department.Trim().ToUpper(),
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(model.Password),
                    Status       = "ACTIVE",
                    CreatedAt    = DateTime.UtcNow
                };

                _context.Users.Add(user);

                // Find the corresponding applicant and update their status
                // Matches based on the Full Name selected from the dropdown
                var applicant = await _context.Applicants
                    .FirstOrDefaultAsync(a => (a.FirstName + " " + a.LastName).ToUpper() == cleanName 
                                         && a.Status == "APPROVED");
                
                if (applicant != null)
                {
                    applicant.Status = "ACCOUNT_CREATED";
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok(new { message = "PROVISIONED" });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { message = "KERNEL_PROVISIONING_FAILURE", details = ex.Message });
            }
        }

        // ─── 3. SYSTEM SETTINGS (GET) ─────────────────────────────────────────
        [HttpGet("syssetting")]
        public async Task<IActionResult> GetSettings()
        {
            try
            {
                var settings = await _context.SystemSettings.FirstOrDefaultAsync();
                if (settings == null)
                {
                    settings = new SystemSettings { SessionTimeout = 30, PasswordExpiry = 90, StorageUsage = 84 };
                    _context.SystemSettings.Add(settings);
                    await _context.SaveChangesAsync();
                }
                return Ok(settings);
            }
            catch (Exception ex) { return StatusCode(500, new { message = "DB_SYNC_ERROR", details = ex.Message }); }
        }

        // ─── 4. SYSTEM SETTINGS (UPDATE) ──────────────────────────────────────
        [HttpPut("syssetting")]
        public async Task<IActionResult> UpdateSettings([FromBody] SystemSettings model)
        {
            var settings = await _context.SystemSettings.FirstOrDefaultAsync();
            if (settings == null) return NotFound();

            settings.SessionTimeout = model.SessionTimeout;
            settings.MfaRequired = model.MfaRequired;
            settings.AlertCritical = model.AlertCritical;
            // ... update other fields as needed
            
            await _context.SaveChangesAsync();
            return Ok(settings);
        }

        // ─── 5. FETCH ALL ACCOUNTS ────────────────────────────────────────────
        [HttpGet("accounts")]
        public async Task<IActionResult> GetAllAccounts()
        {
            var users = await _context.Users
                .Select(u => new {
                    id = u.Id,
                    name = u.Name,
                    employeeId = u.EmployeeId,
                    role = u.Role,
                    department = u.Department,
                    status = u.Status ?? "ACTIVE"
                }).ToListAsync();
            return Ok(users);
        }

        // ─── 6. LOGIN AUDIT LOGS ──────────────────────────────────────────────
        [HttpGet("login-logs")]
        public async Task<IActionResult> GetLoginLogs()
        {
            var logs = await _context.LoginLogs
                .OrderByDescending(l => l.Timestamp)
                .Take(100)
                .ToListAsync();
            return Ok(logs);
        }

        // ─── 7. UPDATE / REVOKE / REACTIVATE ──────────────────────────────────
        [HttpPut("update-account/{id}")]
        public async Task<IActionResult> UpdateAccount(int id, [FromBody] UpdateAccountDto model)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();
            user.Name = model.Name.ToUpper();
            user.Role = model.Role.ToUpper();
            await _context.SaveChangesAsync();
            return Ok(new { message = "UPDATED" });
        }

        [HttpPut("revoke-account/{id}")]
        public async Task<IActionResult> RevokeAccount(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();
            user.Status = "INACTIVE";
            await _context.SaveChangesAsync();
            return Ok(new { message = "REVOKED" });
        }

        [HttpPut("reactivate-account/{id}")]
        public async Task<IActionResult> ReactivateAccount(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();
            user.Status = "ACTIVE";
            await _context.SaveChangesAsync();
            return Ok(new { message = "RESTORED" });
        }
    }

    // ─── DTOs ─────────────────────────────────────────────────────────────────
    public class UserRegistrationDto
    {
        public string Name { get; set; } = string.Empty;
        public string EmployeeId { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class UpdateAccountDto
    {
        public string Name { get; set; } = string.Empty;
        public string EmployeeId { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
    }
}
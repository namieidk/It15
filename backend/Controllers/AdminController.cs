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

        // --- 1. SYSTEM SETTINGS (GET) ---
        // Route changed to syssetting as requested
        [HttpGet("syssetting")]
        public async Task<IActionResult> GetSettings()
        {
            try 
            {
                var settings = await _context.SystemSettings.FirstOrDefaultAsync();

                if (settings == null)
                {
                    // FIX: Do NOT set "Id = 1". Let SQL Server assign the ID automatically.
                    settings = new SystemSettings 
                    { 
                        SessionTimeout = 30, 
                        PasswordExpiry = 90, 
                        MfaRequired = true,
                        AlertCritical = true,
                        AlertLogins = false,
                        AlertExports = true,
                        StorageUsage = 84
                    };
                    _context.SystemSettings.Add(settings);
                    await _context.SaveChangesAsync();
                }

                return Ok(settings);
            }
            catch (Exception ex)
            {
                // Returns the inner exception details to help debug DB permission issues
                return StatusCode(500, new { 
                    message = "DATABASE_SYNC_ERROR", 
                    details = ex.InnerException?.Message ?? ex.Message 
                });
            }
        }

        // --- 2. SYSTEM SETTINGS (UPDATE) ---
        [HttpPut("syssetting")]
        public async Task<IActionResult> UpdateSettings([FromBody] SystemSettings model)
        {
            try 
            {
                var settings = await _context.SystemSettings.FirstOrDefaultAsync();
                if (settings == null) return NotFound(new { message = "SETTINGS_NOT_FOUND" });

                settings.SessionTimeout = model.SessionTimeout;
                settings.PasswordExpiry = model.PasswordExpiry;
                settings.MfaRequired    = model.MfaRequired;
                settings.AlertCritical  = model.AlertCritical;
                settings.AlertLogins    = model.AlertLogins;
                settings.AlertExports   = model.AlertExports;
                settings.StorageUsage   = model.StorageUsage;

                await _context.SaveChangesAsync();
                return Ok(settings);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "UPDATE_FAILURE", details = ex.Message });
            }
        }

        // --- 3. FETCH ALL ACCOUNTS ---
        [HttpGet("accounts")]
        public async Task<IActionResult> GetAllAccounts()
        {
            var users = await _context.Users
                .Select(u => new {
                    id         = u.Id,
                    name       = u.Name,
                    employeeId = u.EmployeeId,
                    role       = u.Role,
                    department = u.Department,
                    status     = u.Status ?? "ACTIVE"
                })
                .ToListAsync();

            return Ok(users);
        }

        // --- 4. FETCH LOGIN AUDIT LOGS ---
        [HttpGet("login-logs")]
        public async Task<IActionResult> GetLoginLogs()
        {
            try
            {
                var logs = await _context.LoginLogs
                    .Select(log => new {
                        log.Id,
                        log.EmployeeId,
                        log.IpAddress,
                        log.Status,
                        log.Timestamp,
                        UserDetail = _context.Users
                            .Where(u => u.EmployeeId == log.EmployeeId)
                            .Select(u => new { u.Name, u.Role })
                            .FirstOrDefault()
                    })
                    .OrderByDescending(l => l.Timestamp)
                    .ToListAsync();

                var result = logs.Select(l => new {
                    id = l.Id,
                    user = l.UserDetail?.Name ?? $"UNKNOWN [{l.EmployeeId}]",
                    role = l.UserDetail?.Role ?? "UNAUTHORIZED_ACTOR",
                    ipAddress = l.IpAddress == "::1" ? "127.0.0.1" : l.IpAddress,
                    status = l.Status?.ToUpper() ?? "FAILED",
                    timestamp = l.Timestamp.ToString("yyyy-MM-dd HH:mm:ss"),
                    device = "AXIOM_CORE_V2"
                });

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "KERNEL_LOG_FETCH_FAILURE", details = ex.Message });
            }
        }

        // --- 5. PROVISION ACCOUNT ---
        [HttpPost("provision")]
        public async Task<IActionResult> ProvisionAccount([FromBody] UserRegistrationDto model)
        {
            if (model == null || string.IsNullOrWhiteSpace(model.EmployeeId))
                return BadRequest(new { message = "ALL FIELDS ARE REQUIRED." });

            var cleanId = model.EmployeeId.Trim().ToUpper();

            if (await _context.Users.AnyAsync(u => u.EmployeeId == cleanId))
                return BadRequest(new { message = "EMPLOYEE ID ALREADY REGISTERED." });

            var user = new User {
                Name         = model.Name.Trim().ToUpper(),
                EmployeeId   = cleanId,
                Role         = model.Role.Trim().ToUpper(),
                Department   = model.Department.Trim().ToUpper(),
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(model.Password),
                Status       = "ACTIVE",
                CreatedAt    = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return Ok(new { message = "PROVISIONED" });
        }

        // --- 6. UPDATE ACCOUNT ---
        [HttpPut("update-account/{id}")]
        public async Task<IActionResult> UpdateAccount(int id, [FromBody] UpdateAccountDto model)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound(new { message = "ACCOUNT NOT FOUND." });

            user.Name       = model.Name.Trim().ToUpper();
            user.EmployeeId = model.EmployeeId.Trim().ToUpper();
            user.Role       = model.Role.Trim().ToUpper();
            user.Department = model.Department.Trim().ToUpper();

            await _context.SaveChangesAsync();
            return Ok(new { message = "UPDATED" });
        }

        // --- 7. REVOKE ACCESS ---
        [HttpPut("revoke-account/{id}")]
        public async Task<IActionResult> RevokeAccount(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound(new { message = "USER NOT FOUND" });

            user.Status = "INACTIVE";
            await _context.SaveChangesAsync();
            return Ok(new { message = "ACCESS REVOKED" });
        }

        // --- 8. REACTIVATE ACCESS ---
        [HttpPut("reactivate-account/{id}")]
        public async Task<IActionResult> ReactivateAccount(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound(new { message = "USER NOT FOUND" });

            user.Status = "ACTIVE";
            await _context.SaveChangesAsync();
            return Ok(new { message = "ACCESS RESTORED" });
        }
    }

    public class UserRegistrationDto {
        public string Name { get; set; } = string.Empty;
        public string EmployeeId { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class UpdateAccountDto {
        public string Name { get; set; } = string.Empty;
        public string EmployeeId { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
    }
}
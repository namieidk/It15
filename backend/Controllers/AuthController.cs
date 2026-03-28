using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using YourProject.Data; 
using YourProject.Models; 
using BCrypt.Net;

namespace YourProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AuthController(ApplicationDbContext context)
        {
            _context = context;
        }

        // --- PROVISION USER ---
        [HttpPost("provision")]
        public async Task<IActionResult> Provision([FromBody] ProvisionModel model)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(model.Password))
                    return BadRequest(new { message = "ERROR: Password required." });

                string cleanId = model.EmployeeId?.Trim().ToUpper() ?? "";
                // We keep the password exactly as the user typed it in the form
                string cleanPassword = model.Password.Trim(); 

                if (await _context.Users.AnyAsync(u => u.EmployeeId == cleanId))
                    return BadRequest(new { message = "Conflict: ID already exists." });

                var user = new User
                {
                    Name = model.Name?.Trim().ToUpper(),
                    EmployeeId = cleanId,
                    Role = model.Role?.ToUpper(),
                    Department = model.Department?.ToUpper(),
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(cleanPassword),
                    CreatedAt = DateTime.UtcNow
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();
                return Ok(new { message = "User Provisioned Successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Server Error", detail = ex.Message });
            }
        }

        // --- LOGIN ---
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            string cleanId = model.EmployeeId?.Trim().ToUpper() ?? "";
            string attempt = model.Password ?? "";

            var user = await _context.Users.FirstOrDefaultAsync(u => u.EmployeeId == cleanId);
            if (user == null) return Unauthorized(new { message = "Identity Not Found" });

            // 1. Try Exact Match (Welcome@123456)
            bool isValid = BCrypt.Net.BCrypt.Verify(attempt, user.PasswordHash);

            // 2. Try Trimmed Match (If there's a trailing space)
            if (!isValid) isValid = BCrypt.Net.BCrypt.Verify(attempt.Trim(), user.PasswordHash);

            // 3. Try All-Caps (If they typed WELCOME@123456)
            if (!isValid) isValid = BCrypt.Net.BCrypt.Verify(attempt.ToUpper(), user.PasswordHash);

            // 4. Try All-Lowercase (If they typed welcome@123456)
            if (!isValid) isValid = BCrypt.Net.BCrypt.Verify(attempt.ToLower(), user.PasswordHash);

            if (!isValid)
                return Unauthorized(new { message = "DEBUG: Password incorrect. Check casing." });

            return Ok(new { 
                message = "Success", 
                user = new { name = user.Name, role = user.Role, employeeId = user.EmployeeId } 
            });
        }
    }

    public class ProvisionModel {
        public string Name { get; set; } = "";
        public string EmployeeId { get; set; } = "";
        public string Role { get; set; } = "";
        public string Department { get; set; } = "";
        public string Password { get; set; } = "";
    }

    public class LoginModel {
        public string EmployeeId { get; set; } = "";
        public string Password { get; set; } = "";
    }
}
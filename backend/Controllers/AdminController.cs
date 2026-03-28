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

        [HttpGet("accounts")]
        public async Task<IActionResult> GetAllAccounts()
        {
            var users = await _context.Users
                .Select(u => new {
                    u.Id,
                    u.Name,
                    u.EmployeeId,
                    u.Role,
                    Status = "ACTIVE"
                })
                .ToListAsync();

            return Ok(users);
        }

        [HttpPost("provision")]
        public async Task<IActionResult> ProvisionAccount([FromBody] UserRegistrationDto model)
        {
            if (model == null ||
                string.IsNullOrWhiteSpace(model.Name) ||
                string.IsNullOrWhiteSpace(model.EmployeeId) || 
                string.IsNullOrWhiteSpace(model.Role) ||
                string.IsNullOrWhiteSpace(model.Department) ||
                string.IsNullOrWhiteSpace(model.Password))
            {
                return BadRequest(new { message = "ALL FIELDS ARE REQUIRED." });
            }

            var cleanId = model.EmployeeId.Trim().ToUpper();

            if (cleanId.Length != 6)
            {
                return BadRequest(new { message = $"ID ERROR: '{cleanId}' must be exactly 6 characters." });
            }

            if (await _context.Users.AnyAsync(u => u.EmployeeId == cleanId))
            {
                return BadRequest(new { message = "EMPLOYEE ID ALREADY REGISTERED." });
            }

            Console.WriteLine($"[PROVISION] ID: {cleanId} | Password received: '{model.Password}'");

            var user = new User
            {
                Name         = model.Name.Trim().ToUpper(),
                EmployeeId   = cleanId,
                Role         = model.Role.Trim().ToUpper(),
                Department   = model.Department.Trim().ToUpper(),
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(model.Password), // ✅ Hashes exactly what was typed
                CreatedAt    = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Account Provisioned Successfully" });
        }
    }

    public class UserRegistrationDto
    {
        public string Name       { get; set; } = string.Empty;
        public string EmployeeId { get; set; } = string.Empty;
        public string Role       { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public string Password   { get; set; } = string.Empty;
    }
}
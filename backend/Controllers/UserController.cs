using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using YourProject.Data;
using YourProject.Models;

namespace YourProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/User/profile/{employeeId}
        [HttpGet("profile/{employeeId}")]
        public async Task<IActionResult> GetManagerProfile(string employeeId)
        {
            var empId = employeeId.Trim();

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.EmployeeId == empId);

            if (user == null)
                return NotFound(new { message = $"Identity {empId} not found in Axiom Core." });

            // Fetch direct reports (Employees in the same department)
            var directReports = await _context.Users
                .Where(u => u.Department == user.Department && 
                            u.Role.ToUpper() == "EMPLOYEE" && 
                            u.EmployeeId != empId)
                .Select(u => new {
                    name = u.Name,
                    role = u.Role,
                    status = u.Status ?? "OFF-SHIFT"
                })
                .ToListAsync();

            return Ok(new
            {
                name          = user.Name,
                employeeId    = user.EmployeeId,
                role          = user.Role,
                department    = user.Department,
                email         = user.Email ?? "NOT CONFIGURED",
                phone         = user.Phone ?? "NOT CONFIGURED",
                workstation   = user.Workstation ?? "UNASSIGNED",
                profileImage  = user.ProfileImage,
                bannerImage   = user.BannerImage, // <-- CRITICAL: Added to GET response
                status        = user.Status ?? "ACTIVE",
                teamSize      = directReports.Count,
                directReports = directReports
            });
        }

        // PUT: api/User/update-profile
        [HttpPut("update-profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] UserProfileUpdateDto dto)
        {
            if (dto == null) return BadRequest("Invalid payload.");

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.EmployeeId == dto.EmployeeId.Trim());

            if (user == null) 
                return NotFound(new { message = "User record not found." });

            // 1. Update Standard Fields
            user.Email = dto.Email;
            user.Phone = dto.Phone;
            user.Workstation = dto.Workstation;
            
            // 2. Update Avatar if provided
            if (!string.IsNullOrEmpty(dto.ProfileImage))
            {
                user.ProfileImage = dto.ProfileImage;
            }

            // 3. Update Banner if provided
            if (!string.IsNullOrEmpty(dto.BannerImage))
            {
                user.BannerImage = dto.BannerImage;
            }

            try 
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                return StatusCode(500, new { message = "Database sync failed.", error = ex.Message });
            }

            return Ok(new { 
                message = "Biometrics and Visuals Updated", 
                profileImage = user.ProfileImage,
                bannerImage = user.BannerImage,
                workstation = user.Workstation 
            });
        }
    }

    // --- DATA TRANSFER OBJECT ---
    public class UserProfileUpdateDto
    {
        public string EmployeeId { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Workstation { get; set; } = string.Empty;
        
        // Visual Assets from Cloudinary
        public string? ProfileImage { get; set; } 
        public string? BannerImage { get; set; }  
    }
}
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using YourProject.Data;
using YourProject.Models;

namespace YourProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ReportsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ─── HELPER: read EmployeeId from custom request header ───────────────
        // Frontend sends: headers: { 'X-Employee-Id': employeeId }
        // employeeId comes from localStorage where login stored it.
        private string? GetEmployeeId()
        {
            return Request.Headers.TryGetValue("X-Employee-Id", out var val)
                ? val.ToString()
                : null;
        }

        // ─── GET /api/Reports/user-profile ───────────────────────────────────
        [HttpGet("user-profile")]
        public async Task<IActionResult> GetUserProfile()
        {
            var employeeId = GetEmployeeId();

            if (string.IsNullOrEmpty(employeeId))
                return Unauthorized(new { message = "Missing X-Employee-Id header. Please log in." });

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.EmployeeId == employeeId);

            if (user == null)
                return NotFound(new { message = $"No user found for EmployeeId: {employeeId}" });

            return Ok(new
            {
                employeeId = user.EmployeeId,
                fullName   = user.Name,
                department = user.Department.ToUpper(),
                position   = user.Role
            });
        }

        // ─── GET /api/Reports/my-reports ─────────────────────────────────────
        [HttpGet("my-reports")]
        public async Task<IActionResult> GetMyReports()
        {
            var employeeId = GetEmployeeId();

            if (string.IsNullOrEmpty(employeeId))
                return Unauthorized(new { message = "Missing X-Employee-Id header. Please log in." });

            var reports = await _context.Reports
                .Where(r => r.EmployeeId == employeeId)
                .OrderByDescending(r => r.CreatedAt)
                .Select(r => new
                {
                    id           = r.Id.ToString(),
                    reportNumber = r.ReportNumber,
                    name         = r.Name,
                    type         = r.Type,
                    status       = r.Status,
                    createdAt    = r.CreatedAt,
                    employeeId   = r.EmployeeId,
                    department   = r.Department,
                    downloadUrl  = r.DownloadUrl ?? "#"
                })
                .ToListAsync();

            return Ok(reports);
        }

        // ─── GET /api/Reports/download/{id} ──────────────────────────────────
        [HttpGet("download/{id:int}")]
        public async Task<IActionResult> DownloadReport(int id)
        {
            var employeeId = GetEmployeeId();

            if (string.IsNullOrEmpty(employeeId))
                return Unauthorized(new { message = "Missing X-Employee-Id header." });

            var report = await _context.Reports
                .FirstOrDefaultAsync(r => r.Id == id && r.EmployeeId == employeeId);

            if (report == null)
                return NotFound(new { message = "Report not found or access denied." });

            // Uncomment if you store PDFs on disk:
            // if (!string.IsNullOrEmpty(report.DownloadUrl) && System.IO.File.Exists(report.DownloadUrl))
            // {
            //     var bytes = await System.IO.File.ReadAllBytesAsync(report.DownloadUrl);
            //     return File(bytes, "application/pdf", $"{report.ReportNumber}.pdf");
            // }

            return Ok(new { downloadUrl = report.DownloadUrl });
        }

        // ─── GET /api/Reports/summary ─────────────────────────────────────────
        [HttpGet("summary")]
        public async Task<IActionResult> GetSummary()
        {
            var employeeId = GetEmployeeId();

            if (string.IsNullOrEmpty(employeeId))
                return Unauthorized(new { message = "Missing X-Employee-Id header." });

            var reports = await _context.Reports
                .Where(r => r.EmployeeId == employeeId)
                .ToListAsync();

            var summary = new
            {
                total    = reports.Count,
                approved = reports.Count(r => r.Status.ToUpper() == "APPROVED"),
                pending  = reports.Count(r => r.Status.ToUpper() == "PENDING"),
                rejected = reports.Count(r => r.Status.ToUpper() == "REJECTED"),
                byType   = reports
                    .GroupBy(r => r.Type?.ToUpper() ?? "UNKNOWN")
                    .Select(g => new { type = g.Key, count = g.Count() })
                    .ToList(),
                byMonth  = reports
                    .GroupBy(r => new { r.CreatedAt.Year, r.CreatedAt.Month })
                    .OrderBy(g => g.Key.Year).ThenBy(g => g.Key.Month)
                    .Select(g => new
                    {
                        month = $"{System.Globalization.CultureInfo.CurrentCulture
                            .DateTimeFormat.GetAbbreviatedMonthName(g.Key.Month)} '{g.Key.Year % 100:D2}",
                        count = g.Count()
                    })
                    .ToList()
            };

            return Ok(summary);
        }
    }
}
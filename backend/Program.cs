using Microsoft.EntityFrameworkCore;
using YourProject.Data;
using YourProject.Hubs;

using YourProject.Middleware;
using IO.Ably; // Add this

var builder = WebApplication.CreateBuilder(args);

// ─── ABLY CONFIGURATION (SECURE) ─────────────────────────────────────────────
string ablyKey = builder.Configuration["Ably:ApiKey"] 
                 ?? throw new Exception("Ably API Key is missing in appsettings.json");
builder.Services.AddSingleton<AblyRest>(new AblyRest(ablyKey));

// ─── SERVICES ─────────────────────────────────────────────────────────────────
builder.Services.AddOpenApi();
builder.Services.AddSignalR();
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();
builder.Services.AddScoped<YourProject.Services.ReportService>();

// ─── CORS ──────────────────────────────────────────────────────────────────────
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowNextJS", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// ─── MIDDLEWARE PIPELINE ──────────────────────────────────────────────────────
app.UseRouting();
app.UseCors("AllowNextJS");
app.UseAuthentication();
app.UseAuthorization();
app.UseAuditLogging();
app.UseStaticFiles();

app.MapControllers();
app.MapHub<AttendanceHub>("/hubs/attendance");

app.Run();
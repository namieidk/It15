using Microsoft.EntityFrameworkCore;
using YourProject.Data;
using YourProject.Hubs;

var builder = WebApplication.CreateBuilder(args);

// --- SERVICES ---
builder.Services.AddOpenApi();
builder.Services.AddSignalR();
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowNextJS", policy =>
    {
        policy.WithOrigins("http://localhost:3000") // Matches your Frontend
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials(); // REQUIRED for SignalR
    });
});

var app = builder.Build();

// --- MIDDLEWARE PIPELINE ---

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// 1. MUST BE FIRST
app.UseRouting();

// 2. MUST BE AFTER UseRouting AND BEFORE UseAuthorization/MapHub
app.UseCors("AllowNextJS");

app.UseAuthorization();

// 3. MAP YOUR ENDPOINTS
app.MapControllers();
app.MapHub<AttendanceHub>("/hubs/attendance");

// Optional: Keep or remove weather forecast
app.MapGet("/weatherforecast", () => {
    var summaries = new[] { "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching" };
    return Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast(
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]))
        .ToArray();
}).WithName("GetWeatherForecast");

app.Run();

// Record stays at the bottom
record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
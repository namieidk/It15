using Microsoft.EntityFrameworkCore;
using YourProject.Models;

namespace YourProject.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) 
            : base(options) { }

        // This represents the "Users" table
        public DbSet<User> Users { get; set; }

        public DbSet<LoginLog> LoginLogs { get; set; }
    }
}
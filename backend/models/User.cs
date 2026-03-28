using System.ComponentModel.DataAnnotations;

namespace YourProject.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required, StringLength(100)]
        public string Name { get; set; }

        [Required, StringLength(50)] 
        public string EmployeeId { get; set; }

        [Required]
        public string PasswordHash { get; set; }

        [Required]
        public string Role { get; set; } = "ADMIN"; 

        // ✅ NEW FIELD ADDED
        [Required, StringLength(100)]
        public string Department { get; set; } = "ADMINISTRATION";

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
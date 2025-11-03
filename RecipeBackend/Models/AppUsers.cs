using System.ComponentModel.DataAnnotations;

namespace RecipeBackend.Models
{
    public class AppUsers
    {
        [Key]
        public int AppUsersID { get; set; }
        public string? FirstName { get; set;}
        public string? LastName { get; set; }
        public string? FullName { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? Email { get; set; }
        public string? Username { get; set; }
        public string? Password { get; set; }
    }
}
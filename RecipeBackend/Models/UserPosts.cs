using System.ComponentModel.DataAnnotations;

namespace RecipeBackend.Models
{
    public class UserPosts
    {
        [Key]
        public int PostID { get; set; }
        public int UserID { get; set; }
        public string? Content { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int? Likes { get; set; }
    }
}
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RecipeBackend.Models
{
    public class UserComments
    {
        [Key]
        public int CommentID { get; set; }
        public int UserID { get; set; }
        public int? PostID { get; set; }
        public int? ParentCommentId { get; set; }
        public string Content { get; set; }
        public string PostType { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int? Likes { get; set; }
        public UserComments ParentComment { get; set; }
        public ICollection<UserComments> Replies { get; set; }
        [ForeignKey("UserID")]
        public virtual AppUsers User { get; set; }
    }
}
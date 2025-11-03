using System.ComponentModel.DataAnnotations;

namespace RecipeBackend.Models
{
    public class LikedItems
    {
        [Key]
        public long id { get; set; }
        public string? Username { get; set; }
        public long ItemId { get; set; }
        public DateTime? LikedOn { get; set; }
        public string? ItemType { get; set; }
        public int? ParentID { get; set; }
        public string? PostType { get; set; }
        public string? CommentType { get; set; }
    }
}
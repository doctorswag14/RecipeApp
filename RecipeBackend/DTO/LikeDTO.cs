using RecipeBackend.DTO;
using RecipeBackend.Models;

public class LikeDTO
{
        public string? Username { get; set; }
        public long ItemId { get; set; }
        public DateTime? LikedOn { get; set; }
        public string? ItemType { get; set; }
        public int? ParentID { get; set; }
        public string? PostType { get; set; }
        public string? CommentType { get; set; }
        public bool IsLiking { get; set; }
}
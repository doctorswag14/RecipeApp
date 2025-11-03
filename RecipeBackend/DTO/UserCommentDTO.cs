namespace RecipeBackend.DTO
{
    public class UserCommentDTO
    {
        public int? CommentId { get; set; }
        public int? ParentCommentId { get; set; } // null if top-level
        public int? PostID { get; set; }           // ties it to a recipe/post
        public string? Content { get; set; }
        public DateTime? CreatedAt { get; set; }
        public string? Username { get; set; }
        public string? FullName { get; set; }
        public string? CommentType { get; set; }
        public string? ReplyType { get; set; }
        public int LikesCount { get; set; }
        public bool LikedByUser { get; set; }
        public bool Liked { get; set; }
        public List<UserCommentDTO>? Replies { get; set; }
    }
}
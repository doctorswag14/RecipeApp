using RecipeBackend.DTO;
using RecipeBackend.Models;

public class FeedItemDTO
{
    public string Type { get; set; } // "recipe" or "post"

    public int Id { get; set; }
    public string Title { get; set; }       // for recipes
    public string Content { get; set; }     // for posts
    public DateTime? CreatedAt { get; set; }
    public string FullName { get; set; }
    public int LikesCount { get; set; }
    public bool LikedByUser { get; set; }
    public List<UserCommentDTO> Comments { get; set; }
}
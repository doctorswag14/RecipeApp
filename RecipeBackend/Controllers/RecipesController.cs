using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RecipeBackend.Data;
using RecipeBackend.Models;
using RecipeBackend.DTO;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;

namespace RecipeBackend.Controllers
{
    [Route("api/homerecipes")]
    [ApiController]
    public class RecipesController : ControllerBase
    {
        private readonly RecipeContext _context;
        private readonly IWebHostEnvironment _hostEnvironment;

        public RecipesController(RecipeContext context, IWebHostEnvironment hostEnvironment)
        {
            _context = context;
            _hostEnvironment = hostEnvironment;
        }

        [HttpGet]
        public async Task<ActionResult<PagedResultDTO<FeedItemDTO>>> GetPaged(
            string userName, int page = 0, int pageSize = 20)
        {
            if (pageSize <= 0 || pageSize > 100) pageSize = 20;

            var user = await _context.AppUsers
                .FirstOrDefaultAsync(d => d.Username == userName);

            if (user == null)
                return NotFound("User not found");

            // Get all liked items for this user
            var userLikedItems = await _context.LikedItems.Where(l => l.Username == userName).ToListAsync();

            // Recipes
            var recipes = await _context.Recipes
                .Where(r => r.UserID == user.AppUsersID)
                .Select(r => new FeedItemDTO
                {
                    Type = "recipe",
                    Id = r.RecipeId,
                    Title = r.Title,
                    CreatedAt = r.CreatedDateTime,
                    FullName = _context.AppUsers
                        .Where(u => u.AppUsersID == r.UserID)
                        .Select(u => u.FullName)
                        .FirstOrDefault() ?? "Unknown"
                }).ToListAsync();

            // Posts
            var posts = await _context.UserPosts
                .Where(p => p.UserID == user.AppUsersID)
                .Select(p => new FeedItemDTO
                {
                    Type = "post",
                    Id = p.PostID,
                    Content = p.Content,
                    CreatedAt = p.CreatedAt,
                    FullName = _context.AppUsers
                        .Where(u => u.AppUsersID == p.UserID)
                        .Select(u => u.FullName)
                        .FirstOrDefault() ?? "Unknown"
                })
                .ToListAsync();

            // --- Load Likes for Recipes and Posts ---
            var allIds = recipes.Select(r => r.Id).Concat(posts.Select(p => p.Id)).ToList();

            var allLikes = await _context.LikedItems.Where(l => allIds.Contains(Convert.ToInt32(l.ItemId))).ToListAsync();

            foreach (var recipe in recipes)
            {
                recipe.LikesCount = allLikes.Count(l => l.ItemId == recipe.Id && l.ItemType == "recipe");
                recipe.LikedByUser = userLikedItems.Any(l => l.ItemId == recipe.Id && l.ItemType == "recipe");
            }

            foreach (var post in posts)
            {
                post.LikesCount = allLikes.Count(l => l.ItemId == post.Id && l.ItemType == "post");
                post.LikedByUser = userLikedItems.Any(l => l.ItemId == post.Id && l.ItemType == "post");
            }

            // --- Load Comments ---
            var allComments = await _context.UserComments.Where(c => (c.PostID != null && allIds.Contains(c.PostID.Value))).ToListAsync();

            // Attach comments to feed items
            foreach (var recipe in recipes)
            {
                var commentsForRecipe = allComments.Where(c => c.PostID == recipe.Id && c.PostType == "Recipe").ToList();
                recipe.Comments = BuildCommentTree(commentsForRecipe, null, "RecipeComment", null, userLikedItems, userName);
            }

            foreach (var post in posts)
            {
                var commentsForPost = allComments.Where(c => c.PostID == post.Id && c.PostType == "UserPost").ToList();
                post.Comments = BuildCommentTree(commentsForPost, null, "UserPostComment", null, userLikedItems, userName);
            }
            
            var merged = recipes.Concat(posts).OrderByDescending(f => f.CreatedAt).Skip(page * pageSize).Take(pageSize).ToList();

            var result = new PagedResultDTO<FeedItemDTO>
            {
                Items = merged,
                TotalCount = recipes.Count + posts.Count
            };

            return Ok(result);
        }

        [HttpGet("ForTheWeek")]
        public async Task<ActionResult<IEnumerable<Recipes>>> GetRecipesForTheWeek()
        {
            try
            {
                var recipes = await _context.Recipes.Where(a => a.isRecipeForWeek == true).ToListAsync();

                return Ok(recipes);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Recipes>> GetRecipe(int id)
        {
            var recipe = await _context.Recipes.FindAsync(id);

            if (recipe == null)
            {
                return NotFound();
            }

            return Ok(recipe);
        }

        [HttpPost]
        public async Task<ActionResult<Recipes>> PostRecipe([FromForm] Recipes recipe)
        {
            // Check if a file was uploaded with the form data
            if (Request.Form.Files.Any())
            {
                // Get the uploaded file
                var file = Request.Form.Files["ImageFile"];
                if (file != null)
                {
                    // Process and save the file
                    string uniqueFileName = UploadedFile(file);
                    recipe.ImagePath = uniqueFileName;
                }
            }

            _context.Recipes.Add(recipe);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetRecipe", new { id = recipe.RecipeId }, recipe);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutRecipe(int id, [FromForm] Recipes recipe)
        {
            var recipeItem = await _context.Recipes.FindAsync(id);
            if (recipeItem == null)
            {
                return BadRequest();
            }

            var uniqueFileName = recipeItem.ImagePath ?? "";

            if (Request.Form.Files.Any())
            {
                string oldFilePath = Path.Combine(_hostEnvironment.ContentRootPath, "Images", recipeItem.ImagePath ?? "default.jpg");
                if (System.IO.File.Exists(oldFilePath))
                {
                    System.IO.File.Delete(oldFilePath);
                }

                var file = Request.Form.Files["ImageFile"];
                if (file != null)
                {
                    uniqueFileName = UploadedFile(file);
                }
            }

            recipeItem.Directions = recipe.Directions;
            recipeItem.Ingredients = recipe.Ingredients;
            recipeItem.Title = recipe.Title;
            recipeItem.ImagePath = uniqueFileName;
            recipeItem.Substitution = recipe.Substitution;
            recipeItem.Macros = recipe.Macros;
            recipeItem.Protein = recipe.Protein;
            recipeItem.Calories = recipe.Calories;

            try
            {
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RecipeExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
        }


        [HttpPut("AddRecipeForWeek/{id}")]
        public async Task<IActionResult> SetRecipeForTheWeek(int id)
        {
            var recipeItem = _context.Recipes.Find(id);
            if (recipeItem != null)
            {
                recipeItem.isRecipeForWeek = true;
            }

            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpPut("RemoveRecipeForWeek/{id}")]
        public async Task<IActionResult> RemoveRecipeForTheWeek(int id)
        {
            var recipeItem = _context.Recipes.Find(id);
            if (recipeItem != null)
            {
                recipeItem.isRecipeForWeek = false;
            }

            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRecipe(int id)
        {
            var recipe = await _context.Recipes.FindAsync(id);
            if (recipe == null)
            {
                return NotFound();
            }

            // Delete the associated image file if it exists
            if (!string.IsNullOrEmpty(recipe.ImagePath))
            {
                string filePath = Path.Combine(_hostEnvironment.ContentRootPath, "Images", recipe.ImagePath);
                if (System.IO.File.Exists(filePath))
                {
                    System.IO.File.Delete(filePath);
                }
            }

            _context.Recipes.Remove(recipe);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool RecipeExists(int id)
        {
            return _context.Recipes.Any(e => e.RecipeId == id);
        }

        private string UploadedFile(IFormFile file)
        {
            // Get the file extension
            string fileExtension = Path.GetExtension(file.FileName);
            // Generate a unique file name using a GUID and the original file extension
            string uniqueFileName = Guid.NewGuid().ToString() + fileExtension;
            // Define the uploads folder path
            string uploadsFolder = Path.Combine(_hostEnvironment.ContentRootPath, "Images");
            string filePath = Path.Combine(uploadsFolder, uniqueFileName);

            // Save the file to the specified path
            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                file.CopyTo(fileStream);
            }

            return uniqueFileName;
        }

        private List<UserCommentDTO> BuildCommentTree(List<UserComments> comments, int? parentId = null, string? postType = null, string? commentType = null, List<LikedItems>? likedItems = null, string? currentUserName = null)
        {
            return comments
                .Where(c => c.ParentCommentId == parentId)
                .Select(c => new UserCommentDTO
                {
                    CommentId = c.CommentID,
                    Username = _context.AppUsers.Where(u => u.AppUsersID == c.UserID).Select(u => u.Username).FirstOrDefault(),
                    FullName = _context.AppUsers.Where(u => u.AppUsersID == c.UserID).Select(u => u.FullName).FirstOrDefault(),
                    Content = c.Content,
                    CreatedAt = c.CreatedAt,
                    ParentCommentId = c.ParentCommentId,
                    CommentType = postType,
                    ReplyType = commentType,
                    LikedByUser = _context.LikedItems?.Any(l =>
                        l.ItemId == c.CommentID &&
                        l.ItemType == "Comment" &&     // or use commentType/postType depending on your LikedItems data
                        l.Username == currentUserName) ?? false,
                    LikesCount = _context.LikedItems?.Count(l =>
                        l.ItemId == c.CommentID &&
                        l.ItemType == "Comment") ?? 0,
                    Replies = BuildCommentTree(comments, c.CommentID, "Reply", postType, likedItems, currentUserName)
                })
                .OrderByDescending(c => c.CreatedAt).ToList();
        }

    }
}
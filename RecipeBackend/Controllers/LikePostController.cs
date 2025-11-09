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
    public class LikePostController : ControllerBase
    {
        private readonly RecipeContext _context;
        private readonly IWebHostEnvironment _hostEnvironment;

        public LikePostController(RecipeContext context, IWebHostEnvironment hostEnvironment)
        {
            _context = context;
            _hostEnvironment = hostEnvironment;
        }

        [HttpPost("LikePost")]
        public async Task<ActionResult<UserCommentDTO>> LikeCommentAndUserPost([FromBody] LikeDTO request)
        {
            var existingLike = _context.LikedItems.FirstOrDefault(l =>
                l.ItemId == request.ItemId &&
                l.Username == request.Username &&
                l.ItemType == request.ItemType);

            if (request.IsLiking == true)
            {
                if (existingLike == null)
                {
                    var newLike = new LikedItems
                    {
                        ItemId = request.ItemId,
                        ItemType = request.ItemType,
                        Username = request.Username,
                        LikedOn = DateTime.UtcNow,
                        ParentID = request.ParentID,
                        CommentType = request.CommentType,
                        PostType = request.PostType
                    };

                    _context.LikedItems.Add(newLike);
                }
            }
            else
            {
                if (existingLike != null)
                {
                    _context.LikedItems.Remove(existingLike);
                }
            }

            await _context.SaveChangesAsync();

            // Count likes for that item
            int likeCount = _context.LikedItems.Count(l => l.ItemId == request.ItemId && l.ItemType == request.ItemType);

            return Ok(new
            {
                success = true,
                liked = request.IsLiking,
                likesCount = likeCount
            });
        }
    }
}
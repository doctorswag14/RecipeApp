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
    [Route("api/userposts")]
    [ApiController]
    public class UserPostsController : ControllerBase
    {
        private readonly RecipeContext _context;
        private readonly IWebHostEnvironment _hostEnvironment;

        public UserPostsController(RecipeContext context, IWebHostEnvironment hostEnvironment)
        {
            _context = context;
            _hostEnvironment = hostEnvironment;
        }

        [HttpPost("AddUserPost")]
        public async Task<ActionResult<UserPostDTO>> PostUserPost([FromForm] UserPostDTO userPost)
        {
            AppUsers appuser = _context.AppUsers.Where(b => b.Username == userPost.Username).FirstOrDefault();
            UserPosts post = new UserPosts
            {
                UserID = appuser.AppUsersID,
                Content = userPost.Post,
                CreatedAt = DateTime.UtcNow
            };

            _context.UserPosts.Add(post);
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("AddUserPostComments")]
        public async Task<ActionResult<UserCommentDTO>> AddUserPostComments([FromForm] UserCommentDTO userComment)
        {
            var appuser = await _context.AppUsers
                .FirstOrDefaultAsync(b => b.Username == userComment.Username);

            if (appuser == null)
                return BadRequest("User not found");

            var comment = new UserComments
            {
                UserID = appuser.AppUsersID,
                Content = userComment.Content,
                PostID = userComment.PostID,               // null if replying to another comment
                ParentCommentId = userComment.ParentCommentId, // ✅ link nested comment
                CreatedAt = DateTime.UtcNow,
                PostType = "UserPost"
            };

            _context.UserComments.Add(comment);
            await _context.SaveChangesAsync();

            // return the saved comment with its new ID
            var dto = new UserCommentDTO
            {
                PostID = comment.PostID,
                ParentCommentId = comment.ParentCommentId,
                Username = userComment.Username,
                Content = comment.Content,
                FullName = userComment.FullName
            };

            return Ok(dto);
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
    }
}
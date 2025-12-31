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
    [Route("api/Profile")]
    [ApiController]
    public class ProfileController : ControllerBase
    {
        private readonly RecipeContext _context;
        private readonly IWebHostEnvironment _hostEnvironment;

        public ProfileController(RecipeContext context, IWebHostEnvironment hostEnvironment)
        {
            _context = context;
            _hostEnvironment = hostEnvironment;
        }

        [HttpGet("{username}")]
        public async Task<ActionResult<AppUsers>> GetRecipe(string username)
        {
            var userData = _context.AppUsers.Where(a => a.Username == username).FirstOrDefault();

            if (userData == null)
            {
                return NotFound();
            }

            return Ok(userData);
        }
    }
}
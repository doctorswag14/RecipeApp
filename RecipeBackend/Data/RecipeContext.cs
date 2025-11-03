using Microsoft.EntityFrameworkCore;
using RecipeBackend.Models;

namespace RecipeBackend.Data
{
    public class RecipeContext : DbContext
    {
        public RecipeContext(DbContextOptions<RecipeContext> options) : base(options) { }

        public DbSet<AppUsers> AppUsers { get; set; }
        public DbSet<UserPosts> UserPosts { get; set; }
        public DbSet<UserComments> UserComments { get; set; }
        public DbSet<Recipes> Recipes { get; set; }
        public DbSet<LikedItems> LikedItems { get; set; }
    }
}
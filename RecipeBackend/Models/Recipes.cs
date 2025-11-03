using System.ComponentModel.DataAnnotations;

namespace RecipeBackend.Models
{
    public class Recipes
    {
        [Key]
        public int RecipeId { get; set; }

        [Required]
        public string Title { get; set; } = string.Empty; // Initialize with default value

        [Required]
        public string Ingredients { get; set; } = string.Empty; // Initialize with default value

        [Required]
        public string Directions { get; set; } = string.Empty; // Initialize with default value

        public string? ImagePath { get; set; } // Mark as nullable if it can be null
        public bool? isRecipeForWeek { get; set; }
        public string? Substitution { get; set; } = string.Empty;
        public string? Tags { get; set; } = string.Empty;
        public int? Calories { get; set; }
        public int? Macros { get; set; }
        public int? Protein { get; set; }
        public string? Username { get; set; }
        public int UserID { get; set; }
        public DateTime? CreatedDateTime { get; set; }
    }
}
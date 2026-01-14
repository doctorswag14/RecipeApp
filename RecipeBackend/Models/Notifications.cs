using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RecipeBackend.Models
{
[Table("Notifications")]
public class Notifications
{
    [Key]
    public int NotificationID { get; set; }
    public int UserID { get; set; }
    public string? NotificationType { get; set; }
    public int ReferenceID { get; set; }
    public string? Message { get; set; }
    public bool? IsRead { get; set; }
    public DateTime? CreatedDateTime {get;set;}
    [ForeignKey(nameof(UserID))]
    public AppUsers? User { get; set; }
}
}
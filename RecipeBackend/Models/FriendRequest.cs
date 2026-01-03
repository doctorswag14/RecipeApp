using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RecipeBackend.Models
{
[Table("FriendRequest")]
public class FriendRequest
{
    [Key]
    public int FriendRequestID { get; set; }

    // Foreign Keys
    public int RequestSenderID { get; set; }
    public int RequestReceiverID { get; set; }

    public DateTime CreatedDateTime { get; set; }

    public string? CreatedBy { get; set; }
    public string? SenderUsername { get; set; }
    public bool? NotificationViewed {get;set;}

    // Navigation Properties
    [ForeignKey(nameof(RequestSenderID))]
    public AppUsers? RequestSender { get; set; }

    [ForeignKey(nameof(RequestReceiverID))]
    public AppUsers? RequestReceiver { get; set; }
}
}
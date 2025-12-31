using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RecipeBackend.Models
{
    public class FriendRequest
    {
        [Key]
        public int FriendRequestID { get; set; }
        public int RequestSenderID {get;set;}
        public int RequestReceiverID {get;set;}
        public DateTime CreatedDateTime {get;set;}
        public string? CreatedBy {get;set;}
        public string? SenderUsername {get;set;}
        [ForeignKey("RequestSenderID")]
        public AppUsers? RequestSender { get; set; }
        [ForeignKey("RequestReceiverID")]
        public AppUsers? RequestReceiver { get; set; }
    }
}
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RecipeBackend.Models
{
    public class Friend
    {
        [Key]
        public int FriendID { get; set; }
        public int SenderID {get;set;}
        public int ReceiverID {get;set;}
        public DateTime CreatedDateTime {get;set;}
        public string? CreatedBy {get;set;}
        [ForeignKey("SenderID")]
        public AppUsers? Sender { get; set; }
        [ForeignKey("ReceiverID")]
        public AppUsers? Receiver { get; set; }
    }
}
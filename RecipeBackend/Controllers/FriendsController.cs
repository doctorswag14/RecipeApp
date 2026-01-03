using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using BCrypt.Net;
using RecipeBackend.Data;
using RecipeBackend.DTO;
using RecipeBackend.Models;

namespace RecipeBackend.Controller
{
    [ApiController]
    [Route("api/Friends")]
    public class FriendsController : ControllerBase
    {
        private readonly RecipeContext _context;
        private readonly IConfiguration _configuration;

        public FriendsController(RecipeContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("sendFriendRequest")]
        public async Task<IActionResult> SendFriendRequest([FromBody] FriendRequestDTO data)
        {
            AppUsers? sender = _context.AppUsers.Where(a => a.Username == data.SenderUsername).FirstOrDefault();
            AppUsers? reciver = _context.AppUsers.Where(a => a.Username == data.ReceiverUsername).FirstOrDefault();

            if (sender == null || reciver == null)
            {
                return BadRequest(new { message = "Sender or Reciver does not exist." });
            }
            else
            {
                
                FriendRequest friendRequest = new FriendRequest
                {
                    RequestSenderID = sender.AppUsersID,
                    RequestReceiverID = reciver.AppUsersID,
                    CreatedDateTime = DateTime.UtcNow,
                    CreatedBy = sender.Username,
                    SenderUsername = sender.Username
                };

                _context.FriendRequests.Add(friendRequest);
                await _context.SaveChangesAsync();
            }

            return Ok();
        }

        [HttpPost("getFriendRequest")]
        public async Task<IActionResult> GetFriendRequest([FromBody] FriendRequestDTO data)
        {
            AppUsers? reciver = _context.AppUsers.Where(a => a.Username == data.ReceiverUsername).FirstOrDefault();

            if (reciver == null)
            {
                return BadRequest(new { message = "Reciver does not exist." });
            }
            else
            {
                List<FriendRequest> friendRequests = _context.FriendRequests.Where(fr => fr.RequestReceiverID == reciver.AppUsersID).ToList();

                return Ok(friendRequests);
            }
        }

        [HttpPost("addFriend")]
        public async Task<IActionResult> AddFriend([FromBody] FriendRequestDTO data)
        {
            AppUsers? sender = _context.AppUsers.Where(a => a.Username == data.SenderUsername).FirstOrDefault();
            AppUsers? reciver = _context.AppUsers.Where(a => a.Username == data.ReceiverUsername).FirstOrDefault();

            if (sender == null ||reciver == null)
            {
                return BadRequest(new { message = "Reciver or Sender does not exist." });
            }
            else
            {
                FriendRequest? friendRequest = _context.FriendRequests.Where(fr => fr.RequestSenderID == sender.AppUsersID && fr.RequestReceiverID == reciver.AppUsersID).FirstOrDefault();
                
                Friend friend = new Friend
                {
                    SenderID = sender.AppUsersID,
                    ReceiverID = reciver.AppUsersID,
                    CreatedDateTime = DateTime.UtcNow,
                    CreatedBy = sender.Username
                };

                _context.Friend.Add(friend);

                await _context.SaveChangesAsync();

                if (friendRequest != null)
                {
                     _context.FriendRequests.Remove(friendRequest);
                }
                
                await _context.SaveChangesAsync();
                return Ok();
            }
        }

        [HttpPost("friendRequests")]
        public async Task<IActionResult> GetFriendNotification([FromBody] FriendRequestDTO data)
        {
            AppUsers? reciver = _context.AppUsers.Where(a => a.Username == data.ReceiverUsername).FirstOrDefault();

            if (reciver == null)
            {
                return BadRequest(new { message = "Reciver does not exist." });
            }
            else
            {
                var friendRequests = _context.FriendRequests.Include(fr => fr.RequestSender).Where(fr =>fr.RequestReceiverID == reciver.AppUsersID && (fr.NotificationViewed == null || fr.NotificationViewed == false)).ToList();
                return Ok(friendRequests);
            }
        }

        [HttpPost("updateNotificationCount")]
        public async Task<IActionResult> UpdateFriendNotificationCount([FromBody] FriendRequestDTO data)
        {
            AppUsers? reciver = _context.AppUsers.Where(a => a.Username == data.ReceiverUsername).FirstOrDefault();

            if (reciver == null)
            {
                return BadRequest(new { message = "Reciver does not exist." });
            }
            else
            {
                List<FriendRequest> friendRequest = _context.FriendRequests.Where(a => a.RequestReceiverID == reciver.AppUsersID && (a.NotificationViewed == null || a.NotificationViewed == false)).ToList();

                foreach(var dataItem in friendRequest)
                {
                    dataItem.NotificationViewed = true;
                }

                await _context.SaveChangesAsync();

                return Ok();
            }
        }
    }
}
using System.ComponentModel.DataAnnotations;

namespace ChatApi.Models
{
    public class JoinRoomForm
    {
        [Required]
        public string RoomName {get; set; }
        [Required]
        public string UserId { get; set; }
        [Required]
        public string Username { get; set; }
    }
}
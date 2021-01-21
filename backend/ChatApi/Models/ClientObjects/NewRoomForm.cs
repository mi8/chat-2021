using System.ComponentModel.DataAnnotations;

namespace ChatApi.Models
{
    public class NewRoomForm
    {
        [Required]
        public string RoomName { get; set; }
    }
}
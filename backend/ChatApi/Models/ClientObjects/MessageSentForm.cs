using System.ComponentModel.DataAnnotations;

namespace ChatApi.Models
{
    public class MessageSentForm
    {
        [Required]
        public string SenderId { get; set; }
        [Required]
        public string SenderName  { get; set; }
        [Required]
        public string Content  { get; set; }
    }
}
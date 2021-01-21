using System.ComponentModel.DataAnnotations;

namespace ChatApi.Models
{
    public class NewContactForm
    {
        [Required]
        public string Username {get; set; }
        [Required]
        public string ContactId { get; set; }
        [Required]
        public string ContactName { get; set; }
    }
}
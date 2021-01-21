using System.ComponentModel.DataAnnotations;

namespace BackEnd.Models
{
    public class AuthenticateModels
    {
        [Required]
        public string Username { get; set; }
        [Required]
        public string Password { get; set; }
    }
}
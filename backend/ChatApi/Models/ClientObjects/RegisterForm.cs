using System.ComponentModel.DataAnnotations;

namespace ChatApi.Models
{
    public class RegisterForm
    {
        [Required]
        public string Username { get; set; }
        [Required]
        public string Password { get; set; }
        [Required]
        public string FirstName { get; set; }   
        [Required]
        public string LastName { get; set; }
    }
}
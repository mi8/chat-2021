using System.ComponentModel.DataAnnotations;

namespace BackEnd.Models
{
    public class RegisterModel
    {
        [Required]
        public string FirstName { get; set; }
        [Required]
        public string LastName { get; set; }
        [Required]
        public string Username { get; set; }
        [Required]
        public string Password { get; set; }
        public int Number { get; set; }
        public string City { get; set; }
        public string Hobby { get; set; }
        public string Country { get; set; }
        public string Role { get; set; } = "User";

    }
}

using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BackEnd.Models
{
    public class User
    {

        public User()
        {
            Tasks = new List<Task>();
        }
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Username { get; set; }
        public byte[] PasswordHash { get; set; }
        public byte[] PasswordSalt { get; set; }
        public int Number { get; set; }
        public string City { get; set; }
        public string Hobby { get; set; }
        public string Country { get; set; }
        public string Role { get; set; }
        public List<Task> Tasks { get; set; }
    }
}
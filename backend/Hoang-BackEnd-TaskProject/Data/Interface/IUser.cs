using BackEnd.Models;
using System.Collections.Generic;

namespace BackEnd.Data
{
    public interface IUser
    {
        User Authenticate(string username, string password);
        IEnumerable<User> GetAllUsers();
        User GetUserById(int id);
        User CreateUser(User user, string password);
        void Update(User user);
        void Delete(int id);
        IEnumerable<object> TasksPerUsers(int id);
        
    }
}
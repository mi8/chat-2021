using System.Collections.Generic;
using System.Threading.Tasks;
using ChatApi.Models;

namespace ChatApi.Repositories
{
    public interface IAccountRepository
    {
        Task<IEnumerable<UserListObject>> GetAllUsers();
        Task<User> GetUser(string userId);
        Task<User> GetUserByUsername(string username);
        Task UpdateUser(string userId, User user);
        Task<User> AddUser(RegisterForm registerForm);
        Task RemoveUser(string userId);
    }
}
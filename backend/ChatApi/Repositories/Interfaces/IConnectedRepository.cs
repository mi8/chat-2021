using System.Collections.Generic;
using System.Threading.Tasks;
using ChatApi.Models;

namespace ChatApi.Repositories
{
    public interface IConnectedRepository
    {
        Task<IEnumerable<UserConnected>> GetAllConnectedUsers();
        Task<UserConnected> GetConnectedUserByUserId(string userId);
        Task<UserConnected> UpdateUserByUserId(string userId, string updatedConnectionId);
        Task<UserConnected> AddUser(string userId, string connectionId);
        Task RemoveUserByUserId(string userId);
    }
}
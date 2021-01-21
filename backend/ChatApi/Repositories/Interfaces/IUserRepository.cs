using System.Collections.Generic;
using System.Threading.Tasks;
using ChatApi.Models;

namespace ChatApi.Repositories
{
    public interface IUserRepository
    {
        Task<User> AddContactToUser(string userId, string contactId, string contactName);
        Task<RoomInUserObject> AddRoomToUser(string userId, string roomId, string roomName);
        Task<User> RemoveRoomFromUser(string userId, string roomId);
        Task<User> AddPrivateMessageToContact(string senderId, string receiverId, MessageSentForm sentMessage);
    }
}
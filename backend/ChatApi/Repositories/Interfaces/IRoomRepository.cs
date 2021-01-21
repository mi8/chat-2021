using System.Collections.Generic;
using System.Threading.Tasks;
using ChatApi.Models;

namespace ChatApi.Repositories
{
    public interface IRoomRepository
    {
        Task<IEnumerable<RoomListObject>> GetAllRooms();
        Task<Room> GetRoom(string roomId);
        Task<Room> GetRoomByRoomName(string roomName);
        Task<Message> GetRoomMessage(string roomId, string roomMessageId);
        Task<Room> AddRoom(NewRoomForm newRoom);
        Task<Room> AddUserToRoom(string roomId, string userId, string username);
        Task<Room> RemoveUserFromRoom(string roomId, string userId);
        Task<Room> AddMessageToRoom(string roomId, MessageSentForm sentMessage);
    }
}
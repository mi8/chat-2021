using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;

using ChatApi.Models;
using ChatApi.Helpers;
using System;
using MongoDB.Bson;

namespace ChatApi.Repositories
{
    public class RoomRepository : BaseMongoRepo, IRoomRepository
    {
        readonly BaseMongoRepo baseMongoRepo;
        readonly IMongoCollection<Room> rooms;

        public RoomRepository(IDbSettings settings): base(settings)
        {
            rooms = mongoDatabase.GetCollection<Room>("Room");
        }

        public async Task<IEnumerable<RoomListObject>> GetAllRooms()
        {
            var filter = Builders<Room>.Filter.Empty;
            var projection = Builders<Room>.Projection.Include("id").Include("RoomName");
            return await rooms.Find<Room>(filter).Project<RoomListObject>(projection).ToListAsync();
        }

        public async Task<Room> GetRoom(string roomId)
        {
            return await rooms.Find(r => r.Id == roomId).FirstOrDefaultAsync();
        }

        public async Task<Room> GetRoomByRoomName(string roomName)
        {
            return await rooms.Find(r => r.RoomName == roomName).FirstOrDefaultAsync();
        }

        public async Task<Message> GetRoomMessage(string roomId, string roomMessageId)
        {
            var room = await rooms.Find(r => r.Id == roomId).FirstOrDefaultAsync();
            var message = room.RoomMessages.Find(m => m.Id == roomMessageId);
            return message;
        }

        public async Task<Room> AddRoom(NewRoomForm newRoom)
        {
            Room room = new Room {
                RoomName = newRoom.RoomName,
                CreatedDate = DateTime.Now,
                RoomUsers = new List<UserInRoomObject>() {},                
                RoomMessages = new List<Message>() {}
            };

            await rooms.InsertOneAsync(room);
            return room;
        }

        public async Task<Room> AddUserToRoom(string roomId, string userId, string username)
        {
            UserInRoomObject user = new UserInRoomObject {
                Id = ObjectId.GenerateNewId().ToString(),
                UserId = userId,
                Username = username,
                JoinedDate = DateTime.Now
            };

            var filter = Builders<Room>.Filter.Eq(r => r.Id, roomId);
            var update = Builders<Room>.Update.Push(r => r.RoomUsers, user);

            return await rooms.FindOneAndUpdateAsync<Room>(filter, update, new FindOneAndUpdateOptions<Room> { ReturnDocument = ReturnDocument.After });
        }

        public async Task<Room> RemoveUserFromRoom(string roomId, string userId)
        {
            var update = Builders<Room>.Update.PullFilter(p => p.RoomUsers, f => f.UserId == userId);
            return await rooms.FindOneAndUpdateAsync<Room>(p => p.Id == roomId, update, new FindOneAndUpdateOptions<Room> { ReturnDocument = ReturnDocument.After });
        }

        public async Task<Room> AddMessageToRoom(string roomId, MessageSentForm sentMessage)
        {           
            Message message = new Message {
                Id = ObjectId.GenerateNewId().ToString(),
                SenderId = sentMessage.SenderId,
                SenderName = sentMessage.SenderName,
                Content = sentMessage.Content,
                SentDate = DateTime.Now
            };

            var filter = Builders<Room>.Filter.Eq(r => r.Id, roomId);
            var update = Builders<Room>.Update.Push(r => r.RoomMessages, message);

            return await rooms.FindOneAndUpdateAsync<Room>(filter, update, new FindOneAndUpdateOptions<Room> { ReturnDocument = ReturnDocument.After });
        }
    }
}

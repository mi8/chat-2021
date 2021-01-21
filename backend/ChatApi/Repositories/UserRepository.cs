using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;

using ChatApi.Models;
using ChatApi.Helpers;
using MongoDB.Bson;

namespace ChatApi.Repositories
{
    public class UserRepository : BaseMongoRepo, IUserRepository
    {
        readonly BaseMongoRepo baseMongoRepo;
        readonly IMongoCollection<User> users;

        public UserRepository(IDbSettings settings): base(settings)
        {
            users = mongoDatabase.GetCollection<User>("Users");
        }

        public async Task<User> AddContactToUser(string userId, string contactId, string contactName)
        {
            Contact contact = new Contact {
                Id = ObjectId.GenerateNewId().ToString(),
                ContactId = contactId,
                ContactName = contactName,
                AddedDate = DateTime.Now,
                Messages = new List<Message>() {}
            };

            var filter = Builders<User>.Filter.Eq(u => u.Id, userId);
            var update = Builders<User>.Update.Push<Contact>(u => u.Contacts, contact);
            return await users.FindOneAndUpdateAsync(filter, update, new FindOneAndUpdateOptions<User> { ReturnDocument = ReturnDocument.After });
        }

        public async Task<RoomInUserObject> AddRoomToUser(string userId, string roomId, string roomName)
        {
            RoomInUserObject room = new RoomInUserObject {
                Id = ObjectId.GenerateNewId().ToString(),
                RoomId = roomId,
                RoomName = roomName,
                JoinedDate = DateTime.Now
            };

            var filter = Builders<User>.Filter.Eq(u => u.Id, userId);
            var update = Builders<User>.Update.Push<RoomInUserObject>(u => u.Rooms, room);
            var updatedDocument = await users.FindOneAndUpdateAsync(filter, update, new FindOneAndUpdateOptions<User> { ReturnDocument = ReturnDocument.After });
            return updatedDocument.Rooms.Find(r => r.RoomId == roomId);
        }

        public async Task<User> RemoveRoomFromUser(string userId, string roomId)
        {
            var filter = Builders<User>.Filter.Eq(u => u.Id, userId);
            var update = Builders<User>.Update.PullFilter(p => p.Rooms, f => f.RoomId == roomId);
            return await users.FindOneAndUpdateAsync<User>(filter, update, new FindOneAndUpdateOptions<User> { ReturnDocument = ReturnDocument.After });
        }
        
        public async Task<User> AddPrivateMessageToContact(string senderId, string receiverId, MessageSentForm sentMessage)
        {    
            Message message = new Message {
                Id = ObjectId.GenerateNewId().ToString(),
                SenderId = sentMessage.SenderId,
                SenderName = sentMessage.SenderName,
                Content = sentMessage.Content,
                SentDate = DateTime.Now
            };

            var filter = Builders<User>.Filter.Eq(u => u.Id, senderId) 
                & Builders<User>.Filter.ElemMatch(x => x.Contacts, Builders<Contact>.Filter.Eq(c => c.ContactId, receiverId));
            var update = Builders<User>.Update.Push(u => u.Contacts[-1].Messages, message);

            return await users.FindOneAndUpdateAsync<User>(filter, update, new FindOneAndUpdateOptions<User> { ReturnDocument = ReturnDocument.After });
        }
    }
}

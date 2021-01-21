using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;
using ChatApi.Models;
using ChatApi.Helpers;
using MongoDB.Bson;
using System;

namespace ChatApi.Repositories
{
    public class ConnectedRepository : BaseMongoRepo, IConnectedRepository
    {
        readonly BaseMongoRepo baseMongoRepo;
        readonly IMongoCollection<UserConnected> connectedUsers;

        public ConnectedRepository(IDbSettings settings): base(settings)
        {
            connectedUsers = mongoDatabase.GetCollection<UserConnected>("ConnectedUsers");
        }

        public async Task<IEnumerable<UserConnected>> GetAllConnectedUsers()
        {
            return await connectedUsers.Find(u => true).ToListAsync();
        }

        public async Task<UserConnected> GetConnectedUserByUserId(string userId)
        {
            return await connectedUsers.Find(u => u.UserId == userId).FirstOrDefaultAsync();
        }

        public async Task<UserConnected> UpdateUserByUserId(string userId, string updatedConnectionId)
        {
            var filter = Builders<UserConnected>.Filter.Eq(u => u.UserId, userId);
            var update = Builders<UserConnected>.Update.Set<string>(u => u.ConnectionId, updatedConnectionId);
            return await connectedUsers.FindOneAndUpdateAsync(filter, update, new FindOneAndUpdateOptions<UserConnected> { ReturnDocument = ReturnDocument.After });
            //await connectedUsers.ReplaceOneAsync(u => u.UserId == userId, updatedUserConnected);
        }

        public async Task<UserConnected> AddUser(string userId, string connectionId)
        {            
            UserConnected newConnection = new UserConnected {
                Id = ObjectId.GenerateNewId().ToString(),
                UserId = userId,
                ConnectionId = connectionId
            };
            await connectedUsers.InsertOneAsync(newConnection);
            return newConnection;
        }

        public async Task RemoveUserByUserId(string userId)
        {
            await connectedUsers.DeleteOneAsync(u => u.UserId == userId);
        }
    }
}

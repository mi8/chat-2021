using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;

using ChatApi.Models;
using ChatApi.Helpers;
using System;
using MongoDB.Bson;

namespace ChatApi.Repositories
{
    public class PublicRepository : BaseMongoRepo, IPublicRepository
    {
        readonly BaseMongoRepo baseMongoRepo;
        readonly IMongoCollection<Message> publicMessages;

        public PublicRepository(IDbSettings settings): base(settings)
        {
            publicMessages = mongoDatabase.GetCollection<Message>("Public");
        }

        public async Task<IEnumerable<Message>> GetPublicMessages()
        {
            return await publicMessages.Find(m => true).ToListAsync();
        }

        public async Task<Message> GetMessage(string messageId)
        {
            return await publicMessages.Find(m => m.Id == messageId).FirstOrDefaultAsync();
        }

        public async Task<Message> AddPublicMessage(MessageSentForm sentMessage)
        {
            Message message = new Message {
                Id = ObjectId.GenerateNewId().ToString(),
                SenderId = sentMessage.SenderId,
                SenderName = sentMessage.SenderName,
                Content = sentMessage.Content,
                SentDate = DateTime.Now
            };

            await publicMessages.InsertOneAsync(message);
            return message;
        }
    }
}

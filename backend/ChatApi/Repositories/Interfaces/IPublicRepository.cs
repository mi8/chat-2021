using System.Collections.Generic;
using System.Threading.Tasks;
using ChatApi.Models;

namespace ChatApi.Repositories
{
    public interface IPublicRepository
    {
        Task<IEnumerable<Message>> GetPublicMessages();
        Task<Message> GetMessage(string messageId);
        Task<Message> AddPublicMessage(MessageSentForm sentMessage);      
    }
}
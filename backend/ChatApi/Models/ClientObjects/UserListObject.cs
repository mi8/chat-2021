using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ChatApi.Models
{
    public class UserListObject
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string Username { get; set; }   
    }
}
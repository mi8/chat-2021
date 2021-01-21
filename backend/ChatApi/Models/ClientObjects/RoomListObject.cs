using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ChatApi.Models
{
    public class RoomListObject
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string RoomName { get; set; }   
    }
}
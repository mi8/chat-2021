using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ChatApi.Models
{
    public class UserInRoomObject
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string UserId { get; set; }
        public string Username { get; set; }       
        public DateTime JoinedDate { get; set; }
    }
}
using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ChatApi.Models
{
    public class RoomInUserObject
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string RoomId { get; set; }
        public string RoomName { get; set; }
        public DateTime JoinedDate { get; set; }
    }
}
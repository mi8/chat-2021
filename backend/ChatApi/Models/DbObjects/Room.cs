using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;

namespace ChatApi.Models
{
    public class Room
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string RoomName { get; set; }
        public DateTime CreatedDate { get; set; }
        public List<UserInRoomObject> RoomUsers { get; set; }
        public List<Message> RoomMessages { get; set; }
    }
}
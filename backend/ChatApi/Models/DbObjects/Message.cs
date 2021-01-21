using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ChatApi.Models
{
    public class Message
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string SenderId { get; set; }
        public string SenderName  { get; set; }
        public string Content  { get; set; }
        public DateTime SentDate { get; set; }
    }
}
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;

namespace ChatApi.Models
{
    public class Contact
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string ContactId { get; set; }
        public string ContactName { get; set; }
        public DateTime AddedDate { get; set; }  
        public List<Message> Messages { get; set; }
    }
}
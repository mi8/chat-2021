using System;
using System.ComponentModel.DataAnnotations;

namespace BackEnd.Hub
{
    public class Model
    {
        [Key]
        public int id { get; set; }
        public string user { get; set; }
        public string message { get; set; }
        public DateTime created { get; set; } = DateTime.Now;
    }
}
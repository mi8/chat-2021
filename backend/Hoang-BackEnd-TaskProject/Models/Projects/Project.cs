using System;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace BackEnd.Models
{
    public class Project
    {
        public Project()
        {
            Tasks = new List<Task>();
        }
        [Key]
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public List<Task> Tasks { get; set; }
        public DateTime CreatedOn { get; set; } = DateTime.Now;
    }
}
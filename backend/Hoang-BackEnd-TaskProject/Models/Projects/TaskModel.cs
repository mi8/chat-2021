using System;
using static BackEnd.Models.StatusEnumeration.StatusEnumeration;

namespace BackEnd.Models
{
    public class TaskModel
    {
        public int TaskId { get; set; }
        public string Description { get; set; }
        public Status Status { get; set; }
        public bool Importance { get; set; }
        public int? UserId { get; set; }
        public int ProjectId { get; set; }
        public DateTime CreatedOn { get; set; } = DateTime.Now;
    }

}
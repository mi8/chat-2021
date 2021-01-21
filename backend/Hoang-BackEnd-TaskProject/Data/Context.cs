using BackEnd.Models;
using Microsoft.EntityFrameworkCore;
using BackEnd.Hub;

namespace BackEnd.Data
{
    public class Context : DbContext
    {
        public Context(DbContextOptions<Context> opt) : base(opt)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .HasMany<Task>(s => s.Tasks)
                .WithOne(e => e.User)
                .HasForeignKey(s => s.UserId)
                .OnDelete(DeleteBehavior.SetNull)
                .IsRequired(false);

            modelBuilder.Entity<Project>()
                .HasMany<Task>(s => s.Tasks)
                .WithOne(e => e.Project)
                .HasForeignKey(s => s.ProjectId)
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired();
        }
        public DbSet<User> Users { get; set; }
        public DbSet<Task> Tasks { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<TasksPerUsers> TasksPerUsers { get; set; }
        public DbSet<Model> Messages { get; set; }
    }
}
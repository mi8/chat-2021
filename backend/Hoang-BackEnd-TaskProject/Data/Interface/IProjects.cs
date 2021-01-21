using BackEnd.Models;
using System.Collections.Generic;

namespace BackEnd.Data.Interface
{
    public interface IProjects
    {
        IEnumerable<ProjectModel> GetAllProjects();
        ProjectModel GetOneProject(int id);
        IEnumerable<ProjectModel> AddProject(Project project);
        Project EditProject(int id, Project project);
        void DeleteProject(int id);
        IEnumerable<Task> GetAllTasks(int projectId);
        Task GetOneTask(int projectId, int taskId);
        IEnumerable<Task> AddTask(int projectId, Task task);
        Task EditTask(int projectId, int taskId, TaskModel task);
        void DeleteTask(int projectId, int TaskId);
    }
}
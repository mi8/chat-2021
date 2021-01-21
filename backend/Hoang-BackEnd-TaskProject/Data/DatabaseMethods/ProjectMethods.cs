using System.Collections.Generic;
using System.Linq;
using BackEnd.Models;
using Microsoft.EntityFrameworkCore;
using BackEnd.Exceptions;
using BackEnd.Data.Interface;

namespace BackEnd.Data.DatabaseMethods
{
    public class ProjectMethods : IProjects
    {
        protected readonly Context _context;
        public ProjectMethods(Context context)
        {
            _context = context;
        }

        // Projects Handling //
        public IEnumerable<ProjectModel> GetAllProjects()
        {
            var result = _context.Projects.Select(p =>
            new ProjectModel
            {
                Id = p.Id,
                Title = p.Title,
                Description = p.Description,
                Tasks = p.Tasks.Select(s => new TaskModel
                {
                    TaskId = s.TaskId,
                    Description = s.Description,
                    Status = s.Status,
                    Importance = s.Importance,
                    ProjectId = s.ProjectId,
                    UserId = s.UserId ?? default(int)
                })
            });
            return result;
        }

        public ProjectModel GetOneProject(int id)
        {
            var singleProject = _context.Projects.Find(id);
            if (singleProject == null)
                throw new NotFoundException("Project not found");
            var result = _context.Projects.Where(u => u.Id == id).Select(p =>
            new ProjectModel
            {
                Id = p.Id,
                Title = p.Title,
                Description = p.Description,
                Tasks = p.Tasks.Select(s => new TaskModel
                {
                    TaskId = s.TaskId,
                    Description = s.Description,
                    Status = s.Status,
                    Importance = s.Importance,
                    UserId = s.UserId ?? default(int),
                    ProjectId = s.ProjectId
                })
            }).FirstOrDefault();
            return result;
        }

        public IEnumerable<ProjectModel> AddProject(Project project)
        {
            _context.Projects.Add(project);
            _context.SaveChanges();
            var result = _context.Projects.Select(p =>
            new ProjectModel
            {
                Id = p.Id,
                Title = p.Title,
                Description = p.Description,
                Tasks = p.Tasks.Select(s => new TaskModel
                {
                    TaskId = s.TaskId,
                    Description = s.Description,
                    Status = s.Status,
                    Importance = s.Importance,
                    ProjectId = s.ProjectId
                })
            });
            return result;
        }

        public Project EditProject(int id, Project project)
        {
            var singleProject = _context.Projects.Find(id);
            if (singleProject == null)
                throw new NotFoundException("Project not found");

            if (!string.IsNullOrWhiteSpace(project.Title))
                singleProject.Title = project.Title;

            if (!string.IsNullOrWhiteSpace(project.Description))
                singleProject.Description = project.Description;

            _context.Projects.Update(singleProject);
            _context.SaveChanges();

            return singleProject;
        }

        public void DeleteProject(int id)
        {
            var singleProject = _context.Projects.Find(id);
            if (singleProject == null)
                throw new NotFoundException("Project not found");
            if (singleProject != null)
            {
                _context.Projects.Remove(singleProject);
                _context.SaveChanges();
            }
        }

        // Task Handling //
        public IEnumerable<Task> GetAllTasks(int projectId)
        {
            var singleProject = _context.Projects.Find(projectId);
            if (singleProject == null)
                throw new NotFoundException("Project not found");
            var tasks = _context.Tasks.Where(x => x.ProjectId == projectId);
            return tasks;
        }
        public Task GetOneTask(int projectId, int taskId)
        {
            var singleProject = _context.Projects.Find(projectId);
            if (singleProject == null)
                throw new NotFoundException("Project not found");
            var project = _context.Projects.Include(s => s.Tasks).FirstOrDefault(s => s.Id == projectId);
            var task = project.Tasks.FirstOrDefault(x => x.TaskId == taskId);
            if (task == null)
                throw new AppException("Task do not exist");
            return task;
        }
        public IEnumerable<Task> AddTask(int projectId, Task task)
        {
            var singleProject = _context.Projects.Find(projectId);
            if (singleProject == null)
                throw new NotFoundException("Project not found");
            singleProject.Tasks.Add(task);
            _context.Update(singleProject);
            _context.SaveChanges();
            return singleProject.Tasks;
        }

        public void DeleteTask(int projectId, int TaskId)
        {
            var singleProject = _context.Projects.Find(projectId);
            if (singleProject == null)
                throw new NotFoundException("Project not found");
            var task = _context.Tasks.Find(TaskId);
            if (task == null)
                throw new AppException("Task do not exist");
            if (task != null && singleProject.Id == task.ProjectId)
            {
                _context.Tasks.Remove(task);
                _context.SaveChanges();
            }
        }

        public Task EditTask(int projectId, int taskId, TaskModel newtask)
        {
            var singleProject = _context.Projects.Include(s => s.Tasks).FirstOrDefault(s => s.Id == projectId);
            if (singleProject == null)
                throw new NotFoundException("Project not found");
            var task = singleProject.Tasks.FirstOrDefault(x => x.TaskId == taskId);
            if (task == null)
                throw new AppException("Task do not exist");
            if (!string.IsNullOrWhiteSpace(newtask.Description))
                task.Description = newtask.Description;
            if (task.Status != newtask.Status)
                task.Status = newtask.Status;
            if (task.Importance != newtask.Importance)
                task.Importance = newtask.Importance;
            if (newtask.UserId != 0)
                task.UserId = newtask.UserId;
            if (newtask.UserId == 0)
                task.UserId = null;
            _context.Update(task);
            _context.SaveChanges();
            return task;
        }
    }
}
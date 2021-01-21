import { Injectable } from '@angular/core';
import { Project } from '../Models/Project';
import { Task } from '../Models/Tasks';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  constructor(private webRequest: WebRequestService) {}

  // Projects //
  getAllProjects() {
    return this.webRequest.getAllProjects('api/projects');
  }

  getOneProject(id: number) {
    return this.webRequest.getOneProject(`api/projects`, id);
  }

  addProject(payload: Project) {
    return this.webRequest.AddProject('api/projects/add', payload);
  }

  editProject(id: number, payload: Project) {
    return this.webRequest.EditProject(`api/projects/${id}`, payload);
  }

  deleteProject(id: number) {
    return this.webRequest.DeleteProject(`api/projects/${id}`);
  }

  addTask(id: number, payload: Task) {
    return this.webRequest.AddTask(`api/projects/${id}/tasks/add`, payload);
  }

  getOneTask(projectId: number, taskId: number) {
    return this.webRequest.getOneTask(
      `api/projects/${projectId}/tasks/${taskId}`
    );
  }

  editTask(projectId: number, taskId: number, payload: Task) {
    return this.webRequest.EditTasks(
      `api/projects/${projectId}/tasks/${taskId}`,
      payload
    );
  }

  deleteTask(projectId: number, taskId: number) {
    return this.webRequest.DeleteTask(
      `api/projects/${projectId}/tasks/${taskId}`
    );
  }
}

import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { Task } from '../../../Models/Tasks';
import { Router } from '@angular/router';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { ProjectService } from 'src/app/services/project.service';
import { defineCustomElements } from '@teamhive/lottie-player/loader';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
})
export class TasksComponent implements OnInit {
  loading: boolean;
  Tasks: Task[] = [];
  PendingTasks: Task[] = [];
  WorkingTasks: Task[] = [];
  ReviewingTasks: Task[] = [];
  CompletedTasks: Task[] = [];
  object = this.auth.decryptedAndDecodedToken();

  constructor(
    private auth: AuthService,
    private router: Router,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    defineCustomElements(window);
    this.auth.getAllTasks(this.object.unique_name).subscribe((res: Task[]) => {
      this.Tasks = res;
      this.PendingTasks = res.filter((x) => x.status == 0);
      this.WorkingTasks = res.filter((x) => x.status == 1);
      this.ReviewingTasks = res.filter((x) => x.status == 2);
      this.CompletedTasks = res.filter((x) => x.status == 3);
      this.loading = false;
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      let projectId = event.item.data.projectId;
      let taskId = event.item.data.taskId;
      if (event.container.id == 'Pending') {
        let updatedTask = { ...event.item.data, status: 0 };
        this.projectService
          .editTask(projectId, taskId, updatedTask)
          .pipe(take(1))
          .subscribe();
      }
      if (event.container.id == 'Working') {
        let updatedTask = { ...event.item.data, status: 1 };
        this.projectService
          .editTask(projectId, taskId, updatedTask)
          .pipe(take(1))
          .subscribe();
      }
      if (event.container.id == 'Reviewing') {
        let updatedTask = { ...event.item.data, status: 2 };
        this.projectService
          .editTask(projectId, taskId, updatedTask)
          .pipe(take(1))
          .subscribe();
      }
      if (event.container.id == 'Complete') {
        let updatedTask = { ...event.item.data, status: 3 };
        this.projectService
          .editTask(projectId, taskId, updatedTask)
          .pipe(take(1))
          .subscribe();
      }
    }
  }
}

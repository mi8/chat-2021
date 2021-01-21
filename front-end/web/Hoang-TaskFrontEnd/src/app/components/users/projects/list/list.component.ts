import { Component, OnInit } from '@angular/core';
import { ProjectService } from 'src/app/services/project.service';
import { Project } from 'src/app/Models/Project';
import { take } from 'rxjs/operators';
import { Task } from 'src/app/Models/Tasks';
import { defineCustomElements } from '@teamhive/lottie-player/loader';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  loading: boolean;
  projects: Project[] = [];
  completedTasks: Task[][];
  notAssignedTasks: Task[][];

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    defineCustomElements(window);
    this.projectService
      .getAllProjects()
      .pipe(take(1))
      .subscribe((projects: Project[]) => {
        this.projects = projects;
        this.completedTasks = projects.map((x) =>
          x.tasks.filter((x: Task) => x.status == 3)
        );
        this.notAssignedTasks = projects.map((x) =>
          x.tasks.filter((x: Task) => x.userId == 0)
        );
        this.loading = false;
      });
  }
}

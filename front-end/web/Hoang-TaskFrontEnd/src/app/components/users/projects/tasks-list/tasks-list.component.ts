import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, of, throwError } from 'rxjs';
import { catchError, map, switchMap, take } from 'rxjs/operators';
import { Project } from 'src/app/Models/Project';
import { AuthService } from 'src/app/services/auth.service';
import { ProjectService } from 'src/app/services/project.service';
import { UserReceived } from 'src/app/Models/UsersReceived';
import { Task } from 'src/app/Models/Tasks';
import { defineCustomElements } from '@teamhive/lottie-player/loader';

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.scss'],
})
export class TasksListComponent implements OnInit {
  project: Project;
  loading: boolean;
  id: number;
  object = this.auth.decryptedAndDecodedToken();
  PendingTasks: Task[] = [];
  WorkingTasks: Task[] = [];
  ReviewingTasks: Task[] = [];
  CompletedTasks: Task[] = [];

  constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    defineCustomElements(window);
    this.id = this.route.snapshot.params.id;
    this.projectService
      .getOneProject(this.id)
      .pipe(
        switchMap((project: Project) => {
          if (project.tasks.length > 0) {
            return forkJoin([
              ...project.tasks.map((item) =>
                item.userId
                  ? this.auth.getOne(item.userId).pipe(
                      map((user: UserReceived) => {
                        return { ...item, user: user?.username };
                      })
                    )
                  : of({ ...item })
              ),
            ]).pipe(
              map((singleProject) => {
                return { ...project, tasks: singleProject };
              })
            );
          } else {
            return of(project);
          }
        }),
        take(1),
        catchError((err) => {
          this.router.navigate(['/projects']);
          return throwError(err);
        })
      )
      .subscribe((singleProject: Project) => {
        this.project = singleProject;
        this.PendingTasks = singleProject.tasks.filter((x) => x.status == 0);
        this.WorkingTasks = singleProject.tasks.filter((x) => x.status == 1);
        this.ReviewingTasks = singleProject.tasks.filter((x) => x.status == 2);
        this.CompletedTasks = singleProject.tasks.filter((x) => x.status == 3);
        this.loading = false;
      });
  }

  assignTask(el) {
    let updatedTask = {
      ...el,
      userId: this.object.unique_name,
    };
    this.projectService
      .editTask(el.projectId, el.taskId, updatedTask)
      .pipe(take(1))
      .subscribe(() => {
        el.userId = this.object.unique_name;
        this.auth
          .getOne(this.object.unique_name)
          .pipe(take(1))
          .subscribe((user: UserReceived) => {
            el.user = user.username;
          });
      });
  }

  removeTask(el) {
    let updatedTask = {
      ...el,
      status: 0,
      userId: 0,
    };
    this.projectService
      .editTask(el.projectId, el.taskId, updatedTask)
      .pipe(take(1))
      .subscribe(() => {
        el.status = 0;
        el.userId = 0;
        el.user = 'Not Assigned';
      });
  }

  sortByUser(table: Task[]) {
    table.sort((a, b) => (a.userId != 0 && a.userId < b.userId ? -1 : 1));
    this.project.tasks = [...table];
  }

  sortByImportance(table: Task[]) {
    if (table[0].importance) {
      table.sort((a) => (a.importance ? 1 : -1));
    } else {
      table.sort((a) => (a.importance ? -1 : 1));
    }
    this.project.tasks = [...table];
  }

  sortByAssigned(table: Task[]) {
    if (table[0].userId == 0) {
      table.sort((a) => (a.userId == 0 ? 1 : -1));
    } else {
      table.sort((a) => (a.userId != 0 ? 1 : -1));
    }
    this.project.tasks = [...table];
  }

  sortByCompleted(table: Task[]) {
    if (table[0].status == 0) {
      table.sort((a, b) => (a.status > b.status ? -1 : 1));
    } else {
      table.sort((a, b) => (a.status < b.status ? -1 : 1));
    }
    this.project.tasks = [...table];
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  goHome() {
    this.router.navigate(['assignTasks']);
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, of, throwError } from 'rxjs';
import { catchError, map, switchMap, take } from 'rxjs/operators';
import { Project } from 'src/app/Models/Project';
import { AuthService } from 'src/app/services/auth.service';
import { ProjectService } from 'src/app/services/project.service';
import { UserReceived } from 'src/app/Models/UsersReceived';
import { Task } from 'src/app/Models/Tasks';

@Component({
  selector: 'app-kanban',
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.scss'],
})
export class KanbanComponent implements OnInit {
  project: Project;
  loading: boolean;
  id: number;
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

  deleteCompleted(element) {
    this.projectService
      .deleteTask(this.id, element.taskId)
      .subscribe(
        () =>
          (this.CompletedTasks = this.CompletedTasks.filter(
            (x) => x.taskId != element.taskId
          ))
      );
  }
}

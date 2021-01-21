import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { Task } from 'src/app/Models/Tasks';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-user-tasks',
  templateUrl: './user-tasks.component.html',
  styleUrls: ['./user-tasks.component.scss'],
})
export class UserTasksComponent implements OnInit {
  loading: boolean;
  Tasks: Task[] = [];
  PendingTasks: Task[] = [];
  WorkingTasks: Task[] = [];
  ReviewingTasks: Task[] = [];
  CompletedTasks: Task[] = [];
  object = this.auth.decryptedAndDecodedToken();

  constructor(
    private auth: AuthService,
    private route:ActivatedRoute,
  ) {}

  ngOnInit(): void {
    let id = this.route.snapshot.params.id
    console.log(id)
    this.auth
      .getAllTasks(id)
      .pipe(take(1))
      .subscribe((res: Task[]) => {
        this.Tasks = res;
        this.PendingTasks = res.filter((x) => x.status == 0);
        this.WorkingTasks = res.filter((x) => x.status == 1);
        this.ReviewingTasks = res.filter((x) => x.status == 2);
        this.CompletedTasks = res.filter((x) => x.status == 3);
        this.loading = false;
      });
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { Task } from 'src/app/Models/Tasks';
import { UserReceived } from 'src/app/Models/UsersReceived';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
})
export class UserDetailsComponent implements OnInit {
  User: UserReceived;
  tasksComplete: Task[];
  loading: boolean;
  id: number;
  PendingTasks: Task[] = [];
  WorkingTasks: Task[] = [];
  ReviewingTasks: Task[] = [];
  CompletedTasks: Task[] = [];

  constructor(
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params.id;
    this.auth
      .getOne(this.id)
      .pipe(take(1))
      .subscribe((user: UserReceived) => {
        if (user == null) {
          this.router.navigate(['404']);
        }
        this.User = user;
        this.PendingTasks = this.User.tasks.filter((x) => x.status == 0);
        this.WorkingTasks = this.User.tasks.filter((x) => x.status == 1);
        this.ReviewingTasks = this.User.tasks.filter((x) => x.status == 2);
        this.CompletedTasks = this.User.tasks.filter((x) => x.status == 3);
        this.loading = false;
      });
  }

  deleteUser(value) {
    this.auth.deleteUser(value.id).subscribe((res) => {
      this.router.navigate(['users']);
    });
  }
}

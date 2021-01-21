import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { Task } from 'src/app/Models/Tasks';
import { UserReceived } from 'src/app/Models/UsersReceived';
import { AuthService } from 'src/app/services/auth.service';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-users-data',
  templateUrl: './users-data.component.html',
  styleUrls: ['./users-data.component.scss'],
})
export class UsersDataComponent implements OnInit {
  loading: boolean;
  users: UserReceived[];
  Tasks: Task[] = [];
  PendingTasks: Task[] = [];
  WorkingTasks: Task[] = [];
  ReviewingTasks: Task[] = [];
  CompletedTasks: Task[] = [];
  numberOfTasks = [];
  randomColor = [];
  object = this.auth.decryptedAndDecodedToken();

  public AllUsersChartType: string = 'bar';
  public AllUsersChartDatasets: Array<any> = [];
  public AllUsersChartLabels: Array<any> = [];
  public AllUsersChartColors: Array<any> = [];

  chartDatasets: Array<any> = [
    { data: [0, 0, 0, 0, 0], label: 'Nothing to display' },
  ];
  public chartType: string = 'bar';
  public chartLabels: Array<any> = [
    'Tasks',
    'Pending',
    'Working',
    'Reviewing',
    'Completed',
  ];

  public chartColors: Array<any> = [
    {
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
      ],
      borderColor: [
        'rgba(255,99,132,1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
      ],
      borderWidth: 2,
    },
  ];

  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.auth
      .getAllUsers()
      .pipe(take(1))
      .subscribe((users: UserReceived[]) => {
        this.users = users;
        users.map((users) => {
          this.AllUsersChartLabels.push(
            this.auth.capitalizeFirstLetter(users.username)
          );
          let tasks = users.tasks.length;
          this.numberOfTasks.push(tasks);
          this.randomColor.push(this.getRandomColor());
          this.AllUsersChartDatasets = [
            { data: this.numberOfTasks, label: "Users's Tasks" },
          ];
          this.AllUsersChartColors = [
            { backgroundColor: this.randomColor, borderWidth: 2 },
          ];
        });
        this.loading = false;
        this.numberOfTasks.push(0);
      });
  }

  select(user) {
    if (user == '') {
      this.chartDatasets = [
        { data: [0, 0, 0, 0, 0], label: 'Nothing to display' },
      ];
    }
    if (user != '') {
      let selectedUser = this.users.find(
        (element) =>
          element.username.toLocaleLowerCase() == user.toLocaleLowerCase()
      );
      this.Tasks = selectedUser.tasks;
      this.PendingTasks = selectedUser.tasks.filter((x) => x.status == 0);
      this.WorkingTasks = selectedUser.tasks.filter((x) => x.status == 1);
      this.ReviewingTasks = selectedUser.tasks.filter((x) => x.status == 2);
      this.CompletedTasks = selectedUser.tasks.filter((x) => x.status == 3);
      this.chartDatasets = [
        {
          data: [
            this.Tasks.length,
            this.PendingTasks.length,
            this.WorkingTasks.length,
            this.ReviewingTasks.length,
            this.CompletedTasks.length,
            0,
          ],
          label: `${selectedUser.username}'s Tasks`,
        },
      ];
    }
  }

  getRandomColor() {
    var color = Math.floor(0x1000000 * Math.random()).toString(16);
    return '#' + ('000000' + color).slice(-6);
  }

  public chartOptions: any = {
    responsive: true,
  };

  public chartClicked(e: any): void {}

  public chartHovered(e: any): void {}
}

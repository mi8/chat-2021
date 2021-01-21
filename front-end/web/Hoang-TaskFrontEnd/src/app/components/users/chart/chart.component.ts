import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError, take } from 'rxjs/operators';
import { Task } from 'src/app/Models/Tasks';
import { AuthService } from 'src/app/services/auth.service';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnInit {
  loading: boolean;
  Tasks: Task[] = [];
  PendingTasks: Task[] = [];
  WorkingTasks: Task[] = [];
  ReviewingTasks: Task[] = [];
  CompletedTasks: Task[] = [];
  object = this.auth.decryptedAndDecodedToken();

  public chartType: string = 'bar';

  chartDatasets: Array<any> = [];

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
    let id = this.route.snapshot.params.id;
    this.auth
      .getAllTasks(id)
      .pipe(
        take(1),
        catchError((err) => {
          this.router.navigate(['profile']);
          return throwError(err);
        })
      )
      .subscribe((res: Task[]) => {
        this.Tasks = res;
        this.PendingTasks = res.filter((x) => x.status == 0);
        this.WorkingTasks = res.filter((x) => x.status == 1);
        this.ReviewingTasks = res.filter((x) => x.status == 2);
        this.CompletedTasks = res.filter((x) => x.status == 3);
        this.loading = false;
        this.chartDatasets = [
          {
            data: [
              this.Tasks.length,
              this.PendingTasks.length,
              this.WorkingTasks.length,
              this.ReviewingTasks.length,
              this.CompletedTasks.length,
            ],
            label: 'Tasks',
          },
        ];
      });
  }

  public chartOptions: any = {
    responsive: true,
  };
  public chartClicked(e: any): void {}
  public chartHovered(e: any): void {}
}

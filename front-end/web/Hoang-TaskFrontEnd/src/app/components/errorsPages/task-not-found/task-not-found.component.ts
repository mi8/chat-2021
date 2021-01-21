import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-task-not-found',
  templateUrl: './task-not-found.component.html',
  styleUrls: ['./task-not-found.component.scss'],
})
export class TaskNotFoundComponent implements OnInit {
  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {}
  goBack() {
    this.router.navigate(['..'], { relativeTo: this.route });
  }
  
  goHome() {
    this.router.navigate(['assignTasks']);
  }
}

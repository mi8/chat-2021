import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-server-down',
  templateUrl: './server-down.component.html',
  styleUrls: ['./server-down.component.scss'],
})
export class ServerDownComponent implements OnInit {
  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {}
  goBack() {
    this.router.navigate(['signin']);
  }

  goHome() {
    this.router.navigate(['assignTasks']);
  }
}

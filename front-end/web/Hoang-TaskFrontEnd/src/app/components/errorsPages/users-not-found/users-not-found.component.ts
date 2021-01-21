import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-users-not-found',
  templateUrl: './users-not-found.component.html',
  styleUrls: ['./users-not-found.component.scss'],
})
export class UsersNotFoundComponent implements OnInit {
  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {}
  goBack() {
    this.router.navigate(['..'], { relativeTo: this.route });
  }
}

import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { Router } from '@angular/router';
import { UserReceived } from '../../../../Models/UsersReceived';
import { take } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  token: Observable<boolean> = this.auth.isAdmin();
  id: number = this.auth.decryptedAndDecodedToken().unique_name;
  data: UserReceived[];
  loading:boolean;

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.token.subscribe((isAdmin) => {
      if (isAdmin) {
        this.auth
          .getAllUsers()
          .pipe(take(1))
          .subscribe((res: UserReceived[]) => {
            this.data = res;
            this.loading = false;
          });
      } else {
        this.router.navigate(['signin']);
      }
    });
  }

  UserDetail(el) {
    this.router.navigate([`/manage/users/${el.id}`]);
  }
}

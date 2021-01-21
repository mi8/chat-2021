import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { UserReceived } from 'src/app/Models/UsersReceived';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Task } from 'src/app/Models/Tasks';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss'],
})
export class ProfilePageComponent implements OnInit {
  loading: boolean;
  propertyEditable: any;
  form: FormGroup;
  message: string;
  originalFirstName: string;
  originalLastName: string;
  object = this.auth.decryptedAndDecodedToken();
  PendingTasks: Task[] = [];
  WorkingTasks: Task[] = [];
  ReviewingTasks: Task[] = [];
  CompletedTasks: Task[] = [];

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.auth
      .getOne(this.object.unique_name)
      .pipe(take(1))
      .subscribe((res: UserReceived) => {
        this.form = new FormGroup({});
        // Instance of this.data
        this.propertyEditable = {};
        Object.keys(res).map((key) => {
          // Create a edit property
          this.propertyEditable[key] = false;
          // Add each controller to the form
          this.form.addControl(
            key,
            new FormControl(res[key], [Validators.required])
          );
          this.loading = false;
        });
        this.originalFirstName = this.form.value.firstName;
        this.originalLastName = this.form.value.lastName;
        this.PendingTasks = this.form.value.tasks.filter((x) => x.status == 0);
        this.WorkingTasks = this.form.value.tasks.filter((x) => x.status == 1);
        this.ReviewingTasks = this.form.value.tasks.filter(
          (x) => x.status == 2
        );
        this.CompletedTasks = this.form.value.tasks.filter(
          (x) => x.status == 3
        );
      });
  }

  sendData(property: string) {
    let updatedUser = {};
    updatedUser[property] = this.form.get(property).value;
    this.auth
      .editUser(this.object.unique_name, updatedUser)
      .pipe(take(1))
      .subscribe(
        (res: HttpResponse<any>) => {
          this.propertyEditable[property] = false;
          this.message = '';
          this.originalFirstName = this.form.value.firstName;
          this.originalLastName = this.form.value.lastName;
          this.router.navigate(['profile']);
        },
        (err: HttpErrorResponse) => (this.message = err.error.message)
      );
  }
}

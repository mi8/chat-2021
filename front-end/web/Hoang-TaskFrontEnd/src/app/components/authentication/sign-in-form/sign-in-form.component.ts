import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { UserAuth } from 'src/app/Models/UserAuth';
import { catchError, switchMap, take, tap } from 'rxjs/operators';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { LocalStorageService } from 'ngx-webstorage';
import { Router } from '@angular/router';
import { ChatService } from 'src/app/services/chat.service';
import { MsalService } from '@azure/msal-angular';

@Component({
  selector: 'app-sign-in-form',
  templateUrl: './sign-in-form.component.html',
  styleUrls: ['./sign-in-form.component.scss'],
})
export class SignInFormComponent implements OnInit {
  signInForm: FormGroup;
  message: string;
  loading: boolean = false;
  // test = new BehaviorSubject<number>(0);

  constructor(
    private auth: AuthService,
    private LocalStorageService: LocalStorageService,
    private router: Router,
    private chatService: ChatService,
    private azureLogin: MsalService
  ) {}

  ngOnInit(): void {
    if (this.LocalStorageService.retrieve('token')) {
      this.auth
        .isAdmin()
        .pipe(
          tap((isAdmin) => {
            if (isAdmin) {
              this.router.navigate(['projects']);
            } else {
              this.router.navigate(['assignTasks']);
            }
          })
        )
        .subscribe();
    }
    this.signInForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });

    // this.BroadcastService.subscribe('msal:loginSuccess', (success) => {
    //   if (success.idToken.claims['acr'] === 'B2C_1_SignUpIn') {
    //     window.alert('Password has been resetted');
    //   }
    //   console.log('success');
    //   return this.azureLogin.logout();
    // });

    // setInterval(() => {
    //   this.test.next(this.testB++)
    // }, 2000);

    // this.test.pipe(tap(console.log)).subscribe()
  }

  sendData(values: UserAuth) {
    values.username = values.username.trim();
    this.auth
      .login(values)
      .pipe(
        take(1),
        switchMap(() => {
          return this.auth.isAdmin().pipe(
            tap((isAdmin) => {
              if (isAdmin) {
                this.router.navigate(['users']);
              } else {
                this.router.navigate(['tasks']);
              }
            })
          );
        }),
        catchError(
          (err: HttpErrorResponse) => (this.message = err.error.message)
        )
      )
      .subscribe();

    this.chatService
      .GetAllUserMongo()
      .pipe(take(1))
      .subscribe((users: any) => {
        if (users.find((x) => x.username == values.username.toLowerCase())) {
          this.chatService
            .Log(values.username.toLocaleLowerCase())
            .pipe(
              take(1),
              tap((data: any) =>
                this.LocalStorageService.store('mongoID', data.body.id)
              )
            )
            .subscribe((res: HttpResponse<any>) => {
              console.log(res);
            });
        } else {
          this.chatService
            .CreateAccount({
              username: values.username.toLocaleLowerCase(),
              password: '12345',
              firstname: 'Default',
              lastName: 'Default',
            })
            .pipe(
              take(1),
              tap((data: any) => {
                this.LocalStorageService.store('mongoID', data.body.id);
              })
            )
            .subscribe();
        }
      });
  }

  AzureLogin() {
    this.azureLogin
      .loginPopup()
      .then((result) => {
        this.loading = true;
        this.auth
          .login({
            username: result.idTokenClaims.emails[0].split('@')[0],
            password: result.idTokenClaims.extension_FirstName,
          })
          .pipe(
            take(1),
            switchMap(() => {
              return this.auth.isAdmin().pipe(
                tap((isAdmin) => {
                  if (isAdmin) {
                    this.router.navigate(['users']);
                  } else {
                    this.router.navigate(['tasks']);
                  }
                })
              );
            }),
            catchError(
              (err: HttpErrorResponse) => (this.message = err.error.message)
            )
          )
          .subscribe();

        this.chatService
          .GetAllUserMongo()
          .pipe(take(1))
          .subscribe((users: any) => {
            if (
              users.find(
                (x) =>
                  x.username == result.idTokenClaims.emails[0].split('@')[0]
              )
            ) {
              this.chatService
                .Log(result.idTokenClaims.emails[0].split('@')[0])
                .pipe(
                  take(1),
                  tap((data: any) =>
                    this.LocalStorageService.store('mongoID', data.body.id)
                  )
                )
                .subscribe((res: HttpResponse<any>) => {
                  console.log(res);
                });
            } else {
              this.chatService
                .CreateAccount({
                  username: result.idTokenClaims.emails[0].split('@')[0],
                  password: '12345',
                  firstname: 'Default',
                  lastName: 'Default',
                })
                .pipe(
                  take(1),
                  tap((data: any) => {
                    this.LocalStorageService.store('mongoID', data.body.id);
                  })
                )
                .subscribe();
            }
          });
      })
      .catch((err) => {
        this.loading = false;
        if (err.errorCode == 'user_cancelled') {
          this.message = 'You cancelled the login process';
        }
        if (err.errorCode == 'server_error') {
          this.message = 'User does not exist';
        }
        if (err.errorCode == 'login_progress_error') {
          this.message = 'You already opened the login page';
        }
      });
  }
}

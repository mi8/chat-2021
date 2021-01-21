import { Component, OnDestroy, OnInit } from '@angular/core';
import { faCommentAlt } from '@fortawesome/free-solid-svg-icons';
import { BroadcastService, MsalService } from '@azure/msal-angular';
import { Logger, CryptoUtils } from 'msal';
import { Subscription } from 'rxjs';
import { UserLogin } from 'src/app/Models/LocalObj/UserLogin';
import { User } from 'src/app/Models/ResponseObj/User';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from 'src/app/Services/user.service';
import { CurrentUserService } from 'src/app/Services/current-user.service';
import { CurrentUser } from 'src/app/Models/LocalObj/CurrentUser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  title = 'Chat App';
  isIframe = false;
  loggedIn = false;

  private subscriptions: Subscription[] = [];

  faCommentAlt = faCommentAlt;

  connectedUser: User;
  user: CurrentUser = null;
  isLoading: boolean;

  constructor(
    private broadcastService: BroadcastService,
    private authService: MsalService,
    private router: Router,
    private userService: UserService,
    private currentUserService: CurrentUserService) { }

  ngOnInit(): void {
    this.isIframe = window !== window.parent && !window.opener;
    this.checkAccount();

    // event listeners for authentication status
    this.subscriptions.push(this.broadcastService.subscribe('msal:loginSuccess', (success) => {

      console.log('login succeeded. id token acquired at: ' + new Date().toString());
      console.log(success);

      let username: string = success.idTokenClaims.emails[0].split("@", 2)[0]
      console.log(username);
      let user: UserLogin = {
        username: username
      };
      this.isLoading = true;
      this.subscriptions.push(this.userService.login(user.username)
        .subscribe(
          (data: User) => {
            this.connectedUser = data;
            this.currentUserService.login(this.connectedUser);
            console.log(this.connectedUser)
            this.router.navigate(['/chat']);
          },
          (error: HttpErrorResponse) => {
            this.isLoading = false;
            console.log(error)
          }
        ))
      this.isLoading = false;

      this.checkAccount();
    }));

    this.subscriptions.push(this.broadcastService.subscribe('msal:loginFailure', (error) => {
      console.log('login failed');
      console.log(error);
    }));

    // redirect callback for redirect flow (IE)
    this.authService.handleRedirectCallback((authError, response) => {
      if (authError) {
        console.error('Redirect Error: ', authError.errorMessage);
        return;
      }
      console.log('Redirect Success: ', response);
    });

    this.authService.setLogger(new Logger((logLevel, message, piiEnabled) => {
      console.log('MSAL Logging: ', message);
    }, {
      correlationId: CryptoUtils.createNewGuid(),
      piiLoggingEnabled: false
    }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  checkAccount() {
    this.loggedIn = !!this.authService.getAccount();
  }

  login() {
    this.authService.loginRedirect();
    this.user = this.currentUserService.currentUserValue;
  }
}


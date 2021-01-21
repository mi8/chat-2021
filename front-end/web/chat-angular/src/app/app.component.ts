import { Component } from '@angular/core';
import { CurrentUser } from './Models/LocalObj/CurrentUser';
import { CurrentUserService } from './Services/current-user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'chat-angular';

  currentUser: CurrentUser;

  constructor(
    private currentUserService: CurrentUserService
  ) {
    this.currentUserService.currentUser.subscribe(x => this.currentUser = x);
  }
}

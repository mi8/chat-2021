import { Component, Input, OnInit } from '@angular/core';
import { faCommentAlt, faUserCircle, faBars } from '@fortawesome/free-solid-svg-icons';
import { MsalService } from '@azure/msal-angular';
import { CurrentUserService } from 'src/app/Services/current-user.service';
import { ChatService } from 'src/app/Services/chat.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GetUserProfileModalComponent } from '../../chat/chat-components/get-user-profile-modal/get-user-profile-modal.component';
import { CurrentUser } from 'src/app/Models/LocalObj/CurrentUser';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  @Input() loggedUser: CurrentUser;

  faCommentAlt = faCommentAlt;
  faUserCircle = faUserCircle;
  faBars = faBars;
  fa
  loggedIn = false;

  constructor(
    private authService: MsalService,
    private currentUserService: CurrentUserService,
    private chatService: ChatService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.checkAccount();
  }

  checkAccount() {
    this.loggedIn = !!this.authService.getAccount();
  }

  logout() {
    this.chatService.disconnection();
    this.currentUserService.logout()
    this.authService.logout();
  }

  showProfileModal() {
    const ref = this.modalService.open(GetUserProfileModalComponent, { centered: true });
    ref.componentInstance.currentUser = this.currentUserService.currentUserValue;
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChatService } from '../../Services/chat.service';
import { Router } from '@angular/router';
import { User } from 'src/app/Models/ResponseObj/User';
import { CurrentUser } from '../../Models/LocalObj/CurrentUser';
import { UserService } from 'src/app/Services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GetUserProfileModalComponent } from './chat-components/get-user-profile-modal/get-user-profile-modal.component';
import { faCommentAlt, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { Contact } from 'src/app/Models/ResponseObj/Contact';
import { Room } from 'src/app/Models/ResponseObj/Room';
import { CurrentUserService } from 'src/app/Services/current-user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {

  private subscription: Subscription;

  faCommentAlt = faCommentAlt;
  faUserCircle = faUserCircle;

  loggedUser: CurrentUser;
  user: User = null;

  public currentContact: Contact = null;
  public currentRoom: Room = null;

  constructor(private chatService: ChatService,
    private currentUser: CurrentUserService,
    private router: Router,
    private userService: UserService,
    private modalService: NgbModal) {}

  ngOnInit(): void {
    this.loggedUser = this.currentUser.currentUserValue;
    console.log(this.loggedUser);
    this.subscription = this.loadUser();
    this.chatService.connection(this.loggedUser.id);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadUser(): Subscription {
    return this.userService.getUserById(this.loggedUser.id).subscribe(
      (data: User) => {
        this.user = data;
      },
      error => {
        console.log(error);
      }
    )
  }

  contactEventHandler($event) {
    this.currentContact = $event;
    console.log(`Current Contact : ${JSON.stringify(this.currentContact)}`)
  }

  roomEventHandler($event) {
    this.currentRoom = $event;
    console.log(`Current Room : ${JSON.stringify(this.currentRoom)}`)
  }

  showProfileModal() {
    const ref = this.modalService.open(GetUserProfileModalComponent, { centered: true });
    ref.componentInstance.currentUser = this.user;
  }

  showContactProfileModal(selectedContact: User) {
    const ref = this.modalService.open(GetUserProfileModalComponent, { centered: true });
    ref.componentInstance.selectedUser = selectedContact;
  }

  logout() {
    this.chatService.disconnection();
    this.currentUser.logout()
    this.router.navigate(['/home'])
  }
}

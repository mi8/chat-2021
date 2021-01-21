import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { NewContactForm } from 'src/app/Models/RequestObj/NewContactForm';
import { User } from 'src/app/Models/ResponseObj/User';
import { UserListObject } from 'src/app/Models/ResponseObj/UserListObject';
import { ChatService } from 'src/app/Services/chat.service';
import { UserService } from 'src/app/Services/user.service';
import { CurrentUser } from '../../../../Models/LocalObj/CurrentUser';

@Component({
  selector: 'app-add-contact-modal',
  templateUrl: './add-contact-modal.component.html',
  styleUrls: ['./add-contact-modal.component.css']
})
export class AddContactModalComponent implements OnInit, OnDestroy {

  private subscription: Subscription;

  public users: UserListObject[];

  @Input() currentUser: User;
  userId: string;
  loggedUser: CurrentUser;

  @Output() emitData = new EventEmitter();

  constructor(private userService: UserService,
    public modal: NgbActiveModal,
    private chatService: ChatService) { }

  ngOnInit(): void {
    this.subscription = this.loadUserList();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadUserList(): Subscription {
    return this.userService.getUsers().subscribe(
      (data: UserListObject[]) => {
        this.users = data;
      },
      error => {
        console.log(error);
      }
    );
  }

  onAddContact(user: UserListObject){
    let newContact: NewContactForm = {
      username: this.currentUser.username,
      contactId: user.id,
      contactName: user.username
    };
    this.chatService.broadcastNewContact(this.currentUser.id, newContact);
  }
}

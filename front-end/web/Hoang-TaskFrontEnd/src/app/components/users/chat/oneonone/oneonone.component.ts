import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Rooms } from 'src/app/Models/ChatModels/Rooms';
import { UserReceived } from 'src/app/Models/UsersReceived';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { LocalStorageService } from 'ngx-webstorage';
import { catchError, switchMap, take, tap } from 'rxjs/operators';
import { MessageReceived } from 'src/app/Models/Messages';
import { ConnectedUsers } from 'src/app/Models/ChatModels/ConnectedUsers';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { forkJoin, of, throwError } from 'rxjs';
import { MongoUsers } from 'src/app/Models/ChatModels/MongoUsers';
import { Contact } from 'src/app/Models/ChatModels/Contacts';

@Component({
  selector: 'app-oneonone',
  templateUrl: './oneonone.component.html',
  styleUrls: ['./oneonone.component.scss'],
})
@UntilDestroy()
export class OneononeComponent implements OnInit {
  token = this.auth.decryptedAndDecodedToken();
  recipient: Contact;
  messages: MessageReceived[] = [];
  loading: boolean;
  chatLoading: boolean;
  user: UserReceived;
  usersList: UserReceived[];
  showUsers: UserReceived[];
  sendMessagePrivate: FormGroup;
  rooms: Rooms[] = [];
  showRooms: Rooms[] = [];
  recipientId: string;
  onlineUsers: ConnectedUsers[] = [];
  mongoSingleUser: MongoUsers;
  mongoToken = this.LocalStorageService.retrieve('mongoID');

  @ViewChild('message') messageRef: ElementRef;
  @ViewChild('container') containerRef: ElementRef;
  constructor(
    private chatService: ChatService,
    private route: ActivatedRoute,
    private auth: AuthService,
    private LocalStorageService: LocalStorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    let getOwnerSession = this.auth.getOne(this.token.unique_name);
    let allUserMongo = this.chatService.GetAllUserMongo();
    let allRooms = this.chatService.GetAllRoom();
    let singleUser = this.chatService.GetSingleMongoUser(this.mongoToken);

    forkJoin([getOwnerSession, allUserMongo, allRooms, singleUser])
      .pipe(
        take(1),
        catchError((error) => {
          return throwError(error);
        })
      )
      .subscribe(
        (result: [UserReceived, UserReceived[], Rooms[], MongoUsers]) => {
          this.user = result[0];
          this.usersList = result[1];
          this.onlineUsers = this.chatService.connectedUsers;
          this.showUsers = [...this.usersList];
          this.rooms = result[2];
          this.showRooms = [...this.rooms];
          this.mongoSingleUser = result[3];
          setTimeout(() => {
            this.loading = false;
          }, 1000);
        }
      );

    this.route.params
      .pipe(
        tap(() => {
          this.chatLoading = true;
        }),
        switchMap((param: Params) => {
          this.recipientId = param.id;
          return this.chatService.GetSingleMongoUser(this.mongoToken);
        }),
        untilDestroyed(this)
      )
      .subscribe((singleUser: MongoUsers) => {
        this.recipient = singleUser.contacts.find(
          (x) => x.contactId == this.recipientId
        );
        if (this.recipient == undefined) {
          this.router.navigate(['404']);
        }
        this.messages = this.recipient.messages;
        setTimeout(() => {
          this.chatLoading = false;
        }, 600);
      });

    this.chatService
      .removeUser()
      .pipe(untilDestroyed(this))
      .subscribe((user) => {
        this.switchOffline(user.id);
      });

    this.chatService
      .retrieveSingleUser()
      .pipe(untilDestroyed(this))
      .subscribe((user: ConnectedUsers) => {
        this.switchOnline(user);
      });

    this.chatService
      .newPrivateMess()
      .pipe(untilDestroyed(this))
      .subscribe((message: any) => {
        if (
          message.sender.senderId == this.mongoToken &&
          message.recipient == this.recipientId
        ) {
          this.addToInbox(message.sender);
          setTimeout(() => {
            this.containerRef.nativeElement.scrollTop = this.containerRef.nativeElement.scrollHeight;
          }, 100);
        }
        if (
          message.recipient == this.mongoToken &&
          message.sender.senderId == this.recipientId
        ) {
          this.addToInbox(message.sender);
          setTimeout(() => {
            this.containerRef.nativeElement.scrollTop = this.containerRef.nativeElement.scrollHeight;
          }, 100);
        }
      });

    this.sendMessagePrivate = new FormGroup({
      message: new FormControl('', [Validators.required]),
    });

    setTimeout(() => {
      this.containerRef.nativeElement.scrollTop = this.containerRef.nativeElement.scrollHeight;
    }, 1200);
  }

  searchUser(el) {
    let valueToSearch = el.toLocaleLowerCase().trim();
    setTimeout(() => {
      let newRooms = this.usersList.filter((users) =>
        users.username.toLocaleLowerCase().includes(valueToSearch)
      );
      this.showUsers = newRooms;
    }, 500);
  }

  searchRoom(el) {
    let valueToSearch = el.toLocaleLowerCase().trim();
    setTimeout(() => {
      let newRooms = this.rooms.filter((rooms) =>
        rooms.roomName.toLocaleLowerCase().includes(valueToSearch)
      );
      this.showRooms = newRooms;
    }, 500);
  }

  breakLineForTextBox(event, el) {
    if (event.ctrlKey && event.key === 'Enter') {
      /*
        cannot make textarea produce a next line.
      */
      var text = <HTMLInputElement>document.getElementById('textarea1');
      text.value += '\n';
      //  text = text.
    } else if (event.key === 'Enter') {
      // allow the form to reset on the 1st line //
      event.preventDefault();
      this.send(el);
    }
  }

  send(el) {
    let message = {
      senderId: this.mongoToken,
      senderName: this.user.username,
      content: el.message,
    };
    if (el != null) {
      this.chatService
        .sendPrivateMessage(this.recipientId, message)
        .subscribe(); // Send the message via a service
      this.sendMessagePrivate.reset();
      this.messageRef.nativeElement.focus();
    }
    setTimeout(() => {
      this.containerRef.nativeElement.scrollTop = this.containerRef.nativeElement.scrollHeight;
    }, 200);
  }

  joinRoom(element: Rooms) {
    this.chatService.GetSingleRoom(element.id).subscribe((data: Rooms) => {
      if (
        data.roomUsers.find((users) => this.mongoToken == users.userId) ==
        undefined
      ) {
        this.chatService
          .joinRoom(element.id, {
            roomName: element.roomName,
            userId: this.mongoToken,
            username: this.user.username,
          })
          .subscribe();
      }
    });
  }

  addContact(el) {
    let newContact = {
      username: this.user.username,
      contactId: el.id,
      contactName: el.username,
    };
    if (
      this.mongoSingleUser.contacts.find(
        (contacts) => contacts.contactId == el.id
      )
    ) {
      this.router.navigate(['/chat/user', el.id]);
    } else {
      this.chatService
        .addContact(this.mongoToken, newContact)
        .pipe(
          take(1),
          catchError((error) => {
            if (error.status == 400) {
              console.log(error);
              return of(false);
            }
          })
        )
        .subscribe(() => {
          this.router.navigate(['/chat/user', el.id]);
        });
    }
  }

  addToInbox(message) {
    this.messages.push(message);
  }

  scrollDown() {
    this.containerRef.nativeElement.scrollTop = this.containerRef.nativeElement.scrollHeight;
  }

  // Helper Methods //

  switchOnline(el) {
    this.onlineUsers.push(el);
  }

  switchOffline(el) {
    this.onlineUsers = this.onlineUsers.filter((users) => users.userId !== el);
  }

  getUniqueListBy(arr, key) {
    return [...new Map(arr.map((item) => [item[key], item])).values()];
  }

  onlineCheck(el) {
    return this.onlineUsers?.find((y) => el.id === y.userId) !== undefined;
  }

  myStyles(el): object {
    if (this.user.username == el.senderName) {
      return { 'background-color': '#6666FF' };
    } else {
      return { 'background-color': '#20B2AA' };
    }
  }
}

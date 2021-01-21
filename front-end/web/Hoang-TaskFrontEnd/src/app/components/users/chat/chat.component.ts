import { MessageReceived } from 'src/app/Models/Messages';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { UserReceived } from 'src/app/Models/UsersReceived';
import { AuthService } from 'src/app/services/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { catchError, map, take } from 'rxjs/operators';
import { colors } from './colors';
import { ChatService } from 'src/app/services/chat.service';
import { LocalStorageService } from 'ngx-webstorage';
import { ConnectedUsers } from 'src/app/Models/ChatModels/ConnectedUsers';
import { Rooms } from 'src/app/models/ChatModels/Rooms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { MongoUsers } from 'src/app/Models/ChatModels/MongoUsers';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
@UntilDestroy()
export class ChatComponent implements OnInit {
  token = this.auth.decryptedAndDecodedToken();
  username: string;
  users: UserReceived[] = [];
  msgDto: MessageReceived;
  msgInboxArray: MessageReceived[] = [];
  textbox: FormGroup;
  loading: boolean;
  onlineUsers: ConnectedUsers[] = [];
  rooms: Rooms[] = [];
  isShown: boolean = false;
  addRoomForm: FormGroup;
  error: string;
  mongoToken: string = this.LocalStorageService.retrieve('mongoID');
  mongoSingleUser: MongoUsers;
  // Allow Focus on the textbox after sending a message
  @ViewChild('message') messageRef: ElementRef;
  @ViewChild('container') containerRef: ElementRef;
  constructor(
    private auth: AuthService,
    private chatService: ChatService,
    private LocalStorageService: LocalStorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.onlineUsers = this.chatService.connectedUsers;
    // Messages //
    this.chatService
      .GetMessage()
      .pipe(take(1))
      .subscribe((mess: MessageReceived[]) => {
        this.msgInboxArray = mess;
        setTimeout(() => {
          this.containerRef.nativeElement.scrollTop = this.containerRef.nativeElement.scrollHeight;
        }, 400);
      });

    // New Messages
    this.chatService
      .retrieveMappedObject()
      .pipe(untilDestroyed(this))
      .subscribe((receivedObj: MessageReceived) => {
        setTimeout(() => {
          this.containerRef.nativeElement.scrollTop = this.containerRef.nativeElement.scrollHeight;
        }, 200);
        this.addToInbox(receivedObj);
      });

    // Users //
    this.chatService
      .GetAllUserMongo()
      .pipe(
        take(1),
        map((users: UserReceived[]) => {
          return users.map((users, index) => {
            return { ...users, colors: colors[index] };
          });
        })
      )
      .subscribe((users: UserReceived[]) => {
        this.users = users;
      });

    // Dynamically track online/offline online users
    this.chatService
      .removeUser()
      .pipe(untilDestroyed(this))
      .subscribe((user) => {
        this.switchOffline(user.id);
      });

    // SingleUser //
    this.chatService
      .retrieveSingleUser()
      .pipe(untilDestroyed(this))
      .subscribe((user: ConnectedUsers) => {
        this.switchOnline(user);
      });

    // Owner Session //
    this.auth
      .getOne(this.token.unique_name)
      .pipe(take(1))
      .subscribe((single: UserReceived) => {
        this.username = single.username;
      });

    // Rooms //
    this.chatService
      .GetAllRoom()
      .pipe(take(1))
      .subscribe((rooms: Rooms[]) => {
        this.rooms = rooms;
        this.loading = false;
      });

    // Check if a new room has been created
    this.chatService
      .retrieveRoom()
      .pipe(untilDestroyed(this))
      .subscribe((room: Rooms) => {
        this.rooms.push(room);
      });

    this.chatService
      .GetSingleMongoUser(this.mongoToken)
      .pipe(take(1))
      .subscribe((user: MongoUsers) => {
        this.mongoSingleUser = user;
      });

    // AddRoom Form //
    this.addRoomForm = new FormGroup({
      roomName: new FormControl('', [
        Validators.required,
        Validators.maxLength(30),
      ]),
    });

    this.textbox = new FormGroup({
      message: new FormControl('', [Validators.required]),
    });
  }

  send(el) {
    if (el != null) {
      this.chatService.broadcastMessage({
        senderId: this.LocalStorageService.retrieve('mongoID'),
        senderName: this.username,
        content: el,
      }); // Send the message via a service
      this.textbox.reset();
      this.messageRef.nativeElement.focus();
    }
    setTimeout(() => {
      this.containerRef.nativeElement.scrollTop = this.containerRef.nativeElement.scrollHeight;
    }, 200);
  }

  addRoom(room) {
    this.chatService
      .AddRoom(room)
      .pipe(
        take(1),
        catchError((err: HttpErrorResponse) => {
          this.error = err.error.message;
          return throwError(err);
        })
      )
      .subscribe(() => {
        this.addRoomForm.reset();
        this.isShown = false;
      });
  }

  joinRoom(element: Rooms) {
    this.chatService.GetSingleRoom(element.id).subscribe((data: Rooms) => {
      if (
        data.roomUsers.find(
          (users) =>
            this.LocalStorageService.retrieve('mongoId') == users.userId
        ) !== undefined
      ) {
        this.router.navigate(['chat', 'room', element.id]);
      } else {
        this.chatService
          .joinRoom(element.id, {
            roomName: element.roomName,
            userId: this.LocalStorageService.retrieve('mongoID'),
            username: this.username,
          })
          .subscribe(() => this.router.navigate(['chat', 'room', element.id]));
      }
    });
  }

  addContact(el) {
    let newContact = {
      username: this.username,
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
              return of(false);
            }
          })
        )
        .subscribe(() => {
          this.router.navigate(['/chat/user', el.id]);
        });
    }
  }

  // Helper Methods //
  addToInbox(obj: MessageReceived) {
    this.msgInboxArray.push({
      senderName: obj.senderName,
      content: obj.content,
      sentDate: new Date(),
    });
  }

  switchOnline(el) {
    this.onlineUsers.push(el);
  }

  switchOffline(el) {
    this.onlineUsers = this.onlineUsers.filter((users) => users.userId !== el);
  }

  myStyles(el): object {
    let colors = this.users.find(
      (x) => x.username.toLowerCase() == el.senderName.toLowerCase()
    );
    if (this.username == el.senderName) {
      return { 'background-color': '#6666FF' };
    }
    if (this.username != el.senderName && colors != undefined) {
      return { 'background-color': colors.colors };
    } else {
      return { 'background-color': 'black' };
    }
  }

  scrollDown() {
    this.containerRef.nativeElement.scrollTop = this.containerRef.nativeElement.scrollHeight;
  }

  onlineCheck(el) {
    return this.onlineUsers?.find((y) => el.id === y.userId) !== undefined;
  }

  showModal() {
    this.isShown = true;
  }

  @HostListener('click', ['$event'])
  onDocumentClick(event) {
    let modal = document.getElementsByClassName('addRoom')[0];
    if (event.target == modal) {
      this.isShown = false;
    }
  }

  closeModal() {
    this.isShown = false;
  }

  // checkJoined(element: Rooms) {
  //   let check = element.roomUsers.find((x) => x.username == this.username);
  //   return check;
  // }

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
}

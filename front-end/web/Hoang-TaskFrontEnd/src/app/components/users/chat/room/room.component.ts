import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Rooms } from 'src/app/Models/ChatModels/Rooms';
import { RoomUsers } from 'src/app/Models/ChatModels/RoomUsers';
import { UserReceived } from 'src/app/Models/UsersReceived';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { LocalStorageService } from 'ngx-webstorage';
import { colors } from 'src/app/components/users/chat/colors';
import { catchError, switchMap, take } from 'rxjs/operators';
import { MessageReceived } from 'src/app/Models/Messages';
import { ConnectedUsers } from 'src/app/Models/ChatModels/ConnectedUsers';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MongoUsers } from 'src/app/Models/ChatModels/MongoUsers';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
})
@UntilDestroy()
export class RoomComponent implements OnInit {
  token = this.auth.decryptedAndDecodedToken();
  loading: boolean;
  roomLoading: boolean;
  singleRoom: Rooms;
  roomMessages: MessageReceived[];
  user: UserReceived;
  usersList: RoomUsers[];
  showUsers: RoomUsers[];
  sendMessageRoom: FormGroup;
  rooms: Rooms[] = [];
  showRooms: Rooms[] = [];
  roomId: string;
  onlineUsers: ConnectedUsers[] = [];

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
    this.onlineUsers = this.chatService.connectedUsers;
    this.chatService
      .retrieveRoom()
      .pipe(untilDestroyed(this))
      .subscribe((room: Rooms) => {
        this.showRooms.push(room);
      });

    this.chatService
      .retrieveUsersInRoom()
      .pipe(untilDestroyed(this))
      .subscribe((user: RoomUsers) => {
        if (this.singleRoom?.roomName == user.roomName) {
          this.showUsers.push({
            userId: user.userId,
            username: user.username,
          });
          this.showUsers = this.getUniqueListBy(this.showUsers, 'username');
        }
      });

    this.chatService
      .retrieveNewMessage()
      .pipe(untilDestroyed(this))
      .subscribe((message: any) => {
        if (this.roomId == message.id) {
          this.addMessageToBox(message);
        }
        setTimeout(() => {
          this.containerRef.nativeElement.scrollTop = this.containerRef.nativeElement.scrollHeight;
        }, 200);
      });

    this.chatService
      .removeUser()
      .pipe(untilDestroyed(this))
      .subscribe((user) => {
        this.switchOffline(user.id);
      });

    this.chatService
      .GetAllRoom()
      .pipe(take(1))
      .subscribe((rooms: Rooms[]) => {
        this.rooms = rooms;
        this.showRooms = [...this.rooms];
        this.roomLoading = false;
      });

    this.route.params
      .pipe(
        switchMap((param: Params) => {
          this.roomId = param.id;
          return this.chatService.GetSingleRoom(this.roomId);
        }),
        catchError((error) => {
          return throwError(error);
        }),
        untilDestroyed(this)
      )
      .subscribe((singleRoom: Rooms) => {
        this.singleRoom = singleRoom;
        this.usersList = singleRoom.roomUsers.map((user, index) => {
          return { ...user, colors: colors[index] };
        });
        this.showUsers = [...this.usersList];
      });

    this.auth
      .getOne(this.token.unique_name)
      .pipe(take(1))
      .subscribe((single: UserReceived) => {
        this.user = single;
        setTimeout(() => {
          this.loading = false;
        }, 1000);
      });

    this.sendMessageRoom = new FormGroup({
      message: new FormControl('', [Validators.required]),
    });

    this.chatService
      .removeUserInRoom()
      .pipe(untilDestroyed(this))
      .subscribe((userLeft: any) => {
        if (userLeft.room == this.roomId) {
          this.showUsers = this.showUsers.filter(
            (users) => users.userId != userLeft.user
          );
        }
      });

    // SingleUser //
    this.chatService
      .retrieveSingleUser()
      .pipe(untilDestroyed(this))
      .subscribe((user: ConnectedUsers) => {
        this.switchOnline(user);
      });

    setTimeout(() => {
      this.containerRef.nativeElement.scrollTop = this.containerRef.nativeElement.scrollHeight;
    }, 1200);
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

  searchUser(el) {
    let valueToSearch = el.toLocaleLowerCase().trim();
    setTimeout(() => {
      let newRooms = this.usersList.filter((users) =>
        users.username.toLocaleLowerCase().includes(valueToSearch)
      );
      this.showUsers = newRooms;
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
      senderId: this.LocalStorageService.retrieve('mongoID'),
      senderName: this.user.username,
      content: el.message,
    };
    if (el != null) {
      this.chatService
        .sendMessageRoom(this.route.snapshot.params.id, message)
        .subscribe(); // Send the message via a service
      this.sendMessageRoom.reset();
      this.messageRef.nativeElement.focus();
    }
    setTimeout(() => {
      this.containerRef.nativeElement.scrollTop = this.containerRef.nativeElement.scrollHeight;
    }, 200);
  }

  addMessageToBox(message) {
    this.singleRoom.roomMessages.push({ ...message, sentDate: new Date() });
  }

  joinRoom(element: Rooms) {
    this.chatService.GetSingleRoom(element.id).subscribe((data: Rooms) => {
      if (
        data.roomUsers.find(
          (users) =>
            this.LocalStorageService.retrieve('mongoId') == users.userId
        ) == undefined
      ) {
        this.chatService
          .joinRoom(element.id, {
            roomName: element.roomName,
            userId: this.LocalStorageService.retrieve('mongoID'),
            username: this.user.username,
          })
          .subscribe();
      }
    });
  }

  joinUser(element: MongoUsers) {
    this.router.navigate(['chat/user/', element.userId]);
  }

  myStyles(el): object {
    let colors = this.usersList.find((x) => x.username == el.senderName);
    if (this.user.username == el.senderName) {
      return { 'background-color': '#6666FF' };
    }
    if (this.user.username != el.senderName && colors != undefined) {
      return { 'background-color': colors.colors };
    } else {
      return { 'background-color': 'black' };
    }
  }

  scrollDown() {
    this.containerRef.nativeElement.scrollTop = this.containerRef.nativeElement.scrollHeight;
  }

  leaveRoom() {
    this.chatService
      .leaveRoom(this.roomId, this.LocalStorageService.retrieve('mongoID'))
      .pipe(take(1))
      .subscribe(() => {
        this.router.navigate(['chat']);
      });
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
    return this.onlineUsers?.find((y) => el.userId === y.userId) !== undefined;
  }
}

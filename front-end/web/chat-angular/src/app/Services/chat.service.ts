import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { HttpClient } from '@angular/common/http';
import { Message } from '../Models/ResponseObj/Message';
import { Observable, Subject } from 'rxjs';
import { Contact } from '../Models/ResponseObj/Contact';
import { Room } from '../Models/ResponseObj/Room';
import { NewContactForm } from '../Models/RequestObj/NewContactForm';
import { MessageForm } from '../Models/RequestObj/MessageForm';
import { NewRoomForm } from '../Models/RequestObj/NewRoomForm';
import { JoinRoomForm } from '../Models/RequestObj/JoinRoomForm';
import { UserConnected } from '../Models/ResponseObj/UserConnected';
import { RoomListObject } from '../Models/ResponseObj/RoomListObject';
import { RoomInUserObject } from '../Models/ResponseObj/RoomInUserObject';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  readonly POST_URL = `${environment.apiBaseUrl}api/chat/`

  hubConnection: signalR.HubConnection;

  private publicMessageObject: Message = new Message();
  private roomMessageObject: Message = new Message();
  private privateMessageObject: Message = new Message();
  private contactObject: Contact = new Contact();
  private newRoomListObject: RoomListObject = new RoomListObject();
  private joinRoomObject: RoomInUserObject = new RoomInUserObject();
  private sharedPublicMessageObj = new Subject<Message>();
  private sharedRoomMessageObj = new Subject<Message>();
  private sharedPrivateMessageObj = new Subject<Message>();
  private sharedContactObj = new Subject<Contact>();
  private sharedNewRoomObj = new Subject<RoomListObject>();
  private sharedJoinRoomObj = new Subject<RoomInUserObject>();

  constructor(private http: HttpClient) {}

  public connection(id) {

    //Init Connection
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.apiBaseUrl}chat?userId=${id}`)
      .configureLogging(signalR.LogLevel.Error)
      .build();

    //Call client methods from hub to get UserConnected
    this.hubConnection.on("newConnectedUser", (connectionId: UserConnected) => {
      console.log(`UserConnected: ${JSON.stringify(connectionId)}`);
    });
    //To do
    this.hubConnection.on("updatedConnectedUser", (connectionId: UserConnected) => {
      console.log(`UpdatedUserConnected: ${JSON.stringify(connectionId)}`);
    });

    this.hubConnection.on("userConnectedList", (connectedUsers: UserConnected[]) => {
      console.log(`Connected users: ${JSON.stringify(connectedUsers)}`);
    })

    //Call client methods from hub to get UserDisconnected
    this.hubConnection.on("newDisconnectedUser", (connectionId: UserConnected) => {
      console.log(`UserDisconnected: ${JSON.stringify(connectionId)}`);
    });

    //Call client methods from hub to update PublicMessage
    this.hubConnection.on("receiveNewPublicMessage", (message: Message) => {
      console.log(`Public: ${JSON.stringify(message)}`);
      this.mapReceivedPublicMessage(message);
    });

    //Call client methods from hub to update Room
    this.hubConnection.on("receiveNewRoom", (room: Room) => {
      console.log(`New Room: ${JSON.stringify(room)}`);
      this.mapReceivedCreatedRoom(room);
    });

    //Call client methods from hub to caller to join group
    this.hubConnection.on("joinRoomSuccess", (room: RoomInUserObject) => {
      console.log(`Join Group: ${JSON.stringify(room)}`);
      this.mapReceivedJoinedRoom(room);
    });

    //Call client methods from hub to group to join group
    this.hubConnection.on("newJoinRoom", (connectionId: string) => {
      console.log(`Added Group User: ${JSON.stringify(connectionId)}`);
    });

    //Call client methods from hub to update RoomMessage
    this.hubConnection.on("receiveNewRoomMessage", (message: Message) => {
      console.log(`Room: ${JSON.stringify(message)}`);
      this.mapReceivedRoomMessage(message);
    });

    //Call client methods from hub to update Contact
    this.hubConnection.on("addedContactOffline", (contact: Contact) => {
      console.log(`New Contact Offline: ${JSON.stringify(contact)}`);
      this.mapReceivedContact(contact);
    });

    //Call client methods from hub to update Contact
    this.hubConnection.on("receiveNewContact", (contact: Contact) => {
      console.log(`New Contact: ${JSON.stringify(contact)}`);
      this.mapReceivedContact(contact);
    });

    //Call client methods from hub to update Contact
    this.hubConnection.on("addedPrivateMessageOffline", (message: Message) => {
      console.log(`New Private Message Offline: ${JSON.stringify(message)}`);
      this.mapReceivedPrivateMessage(message);
    });

    //Call client methods from hub to update PrivateMessage
    this.hubConnection.on("receiveNewPrivateMessage", (message: Message) => {
      console.log(`Private: ${JSON.stringify(message)}`);
      this.mapReceivedPrivateMessage(message);
    });

    //To do
    //Call client methods from hub to caller to quit group
    // this.hubConnection.on("GroupQuitSuccess", (roomName) => {
    //   console.log(`Quit Group: ${roomName}`);
    // });

    //Call client methods from hub to group to quit group
    // this.hubConnection.on("GroupQuit", (connectionId) => {
    //   console.log(`Removed Group User: ${connectionId}`);
    // });

    //this.hubConnection.onclose(() => console.error("onclose"))

    //Start Connection
    this.hubConnection
        .start()
        .then(() => console.log("Connected"))
        .catch((err) => console.error(err.toString()));
  }

  public disconnection() {
    this.hubConnection
      .stop()
      .then(() => console.log("Disconnected"))
      .catch((err) => console.error(err.toString()));
  }

  private mapReceivedPublicMessage(message: Message): void {
    this.publicMessageObject.senderName = message.senderName;
    this.publicMessageObject.content = message.content;
    this.sharedPublicMessageObj.next(this.publicMessageObject);
  }

  private mapReceivedRoomMessage(message: Message): void {
    this.roomMessageObject.senderName = message.senderName;
    this.roomMessageObject.content = message.content;
    this.sharedRoomMessageObj.next(this.roomMessageObject);
  }

  private mapReceivedPrivateMessage(message: Message): void {
    this.privateMessageObject.senderName = message.senderName;
    this.privateMessageObject.content = message.content;
    this.sharedPrivateMessageObj.next(this.privateMessageObject);
  }

  private mapReceivedContact(contact: Contact): void {
    this.contactObject.contactName = contact.contactName;
    this.contactObject.messages = contact.messages;
    this.sharedContactObj.next(this.contactObject);
  }

  private mapReceivedCreatedRoom(room: Room): void {
    this.newRoomListObject.id = room.id;
    this.newRoomListObject.roomName = room.roomName;
    this.sharedNewRoomObj.next(this.newRoomListObject);
  }

  private mapReceivedJoinedRoom(room: RoomInUserObject): void {
    this.joinRoomObject.id = room.id;
    this.joinRoomObject.roomId = room.roomId;
    this.joinRoomObject.roomName = room.roomName;
    this.sharedJoinRoomObj.next(this.joinRoomObject);
  }

  //Methods used in components
  //Public Chat
  public broadcastPublicMessage(message: MessageForm){
    this.http.post(this.POST_URL + 'public/send', message).subscribe(data => console.log(data));
  }

  public retrieveMappedPublicMessage(): Observable<Message> {
    return this.sharedPublicMessageObj.asObservable();
  }
  //Room Chat
  public broadcastNewRoom(roomForm: NewRoomForm) {
    this.http.post(this.POST_URL + 'room/new', roomForm).subscribe(data => console.log(data));
  }

  public joinRoom(roomId: string, joinForm: JoinRoomForm) {
    this.http.post(this.POST_URL + 'room/' + roomId + '/join', joinForm).subscribe(data => console.log(data));
  }

  public broadcastRoomMessage(roomId: string, message: MessageForm) {
    this.http.post(this.POST_URL + 'room/'+ roomId + '/send', message).subscribe(data => console.log(data));
  }

  public retrieveMappedNewRoom(): Observable<RoomListObject> {
    return this.sharedNewRoomObj.asObservable();
  }

  public retrieveMappedJoinRoom(): Observable<RoomInUserObject> {
    return this.sharedJoinRoomObj.asObservable();
  }

  public retrieveMappedRoomMessage(): Observable<Message> {
    return this.sharedRoomMessageObj.asObservable();
  }
  //Private Chat
  public broadcastNewContact(userId: string, contact: NewContactForm) {
    this.http.post(this.POST_URL + 'private/'+ userId + '/new', contact).subscribe(data => console.log(data));
  }

  public broadcastPrivateMessage(receiverId: string, message: MessageForm) {
    this.http.post(this.POST_URL + 'private/' + receiverId + '/send', message).subscribe(data => console.log(data));
  }

  public retrieveMappedContact(): Observable<Contact> {
    return this.sharedContactObj.asObservable();
  }

  public retrieveMappedPrivateMessage(): Observable<Message> {
    return this.sharedPrivateMessageObj.asObservable();
  }
}

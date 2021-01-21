import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr'; // import signalR
import { HttpClient } from '@angular/common/http';
import { MessageReceived } from '../Models/Messages';
import { ConnectedUsers } from '../Models/ChatModels/ConnectedUsers';
import { Rooms } from '../Models/ChatModels/Rooms';
import { merge, Observable, of, Subject } from 'rxjs';
import { LocalStorageService } from 'ngx-webstorage';
import { map } from 'rxjs/operators';
import { MongoUsers } from '../Models/ChatModels/MongoUsers';
import { ConnectionOptions } from 'tls';

@Injectable({
  providedIn: 'root',
})
export class ChatService {

  // Charlotte //
  // readonly URL = `https://localhost:5001/api`;
  // readonly POST_URL = 'https://localhost:5001/api/chat/public/send';
  // readonly CHAT_URL = 'https://localhost:5001/chat';
  readonly URL = 'https://chat-prototype-api.azurewebsites.net/api'
  readonly POST_URL = 'https://chat-prototype-api.azurewebsites.net/api/chat/public/send';
  readonly CHAT_URL = 'https://chat-prototype-api.azurewebsites.net/chat'

  private connection: any = new signalR.HubConnectionBuilder()
    .withUrl(this.CHAT_URL, {
      skipNegotiation: true,
      transport: signalR.HttpTransportType.WebSockets,
    }) // mapping to the chathub as in startup.cs
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .build();

  private receivedMessageObject: MessageReceived;

  private sharedObj = new Subject<MessageReceived>();

  private singleUser: ConnectedUsers;
  private sharedSingle = new Subject<ConnectedUsers>();

  private usersConnected: ConnectedUsers[];
  private sharedUsers = new Subject<ConnectedUsers[]>();

  private roomAdded: Rooms;
  private sharedRooms = new Subject<Rooms>();

  private roomMessage: MessageReceived;
  private sharedRoomMessage = new Subject<MessageReceived>();

  private privateMessageOnline: any;
  private sharedPrivateMessageOnline = new Subject<any>();

  private userJoinRoom: MongoUsers;
  private sharedUsersInRoom = new Subject<MongoUsers>();

  private removedUsers = new Subject<MongoUsers>();
  private removedUsersInRoom = new Subject<any>();

  public connectedUsers: ConnectedUsers[] = [];

  constructor(
    private http: HttpClient,
    private LocalStorageService: LocalStorageService
  ) {
    this.isAuthenticated().subscribe((authenticated) => {
      if (authenticated) {
        this.start();
        this.connection.on('userConnectedList', (users: ConnectedUsers[]) => {
          this.usersConnecting(users);
          this.connectedUsers = users;
        });
        this.connection.on('updatedConnectedUser', (user: ConnectedUsers) => {
          this.singleUserConnected(user);
        });
        this.connection.on('newDisconnectedUser', (user: MongoUsers) => {
          this.removedUsers.next(user);
        });
      } else {
        this.connection.stop();
      }
    });
  }

  // Start the connection
  public async start() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(
        `${this.CHAT_URL}?userId=${this.LocalStorageService.retrieve(
          'mongoID'
        )}`,
        {
          skipNegotiation: true,
          transport: signalR.HttpTransportType.WebSockets,
        }
      ) // mapping to the chathub as in startup.cs
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();
    try {
      await this.connection.start();
      this.connection.on('userConnectedList', (users: ConnectedUsers[]) => {
        this.usersConnecting(users);
      });
      this.connection.on('newConnectedUser', (user: ConnectedUsers) => {
        this.singleUserConnected(user);
      });
      this.connection.on(
        'receiveNewPublicMessage',
        (message: MessageReceived) => {
          this.mapReceivedMessage(message);
        }
      );
      this.connection.on('updatedConnectedUser', (user: ConnectedUsers) => {
        this.singleUserConnected(user);
      });
      this.connection.on('receiveNewRoom', (room: Rooms) => {
        this.addingRoom(room);
      });
      this.connection.on('newJoinRoom', (connectionId, user: MongoUsers) => {
        this.userJoinedRoom(user);
      });
      this.connection.on('joinRoomSuccess', () => {
        console.log('joinroomsuccess');
      });
      this.connection.on('leavingRoom', (roomId: string, userId: string) => {
        this.removedUsersInRoom.next({ room: roomId, user: userId });
      });
      this.connection.on('addedContactOffline', (user) => {
        console.log(user);
      });
      this.connection.on('receiveNewContact', (user) => {
        console.log(user);
      });
      this.connection.on('receiveNewPrivateMessage', (message, receiverId) => {
        this.newPrivateMessage({
          sender: message,
          recipient: receiverId,
        });
      });
      this.connection.on(
        'addedPrivateMessageOffline',
        (message, receiverId) => {
          this.newPrivateMessage({
            sender: message,
            recipient: receiverId,
          });
        }
      );
      this.connection.on(
        'receiveNewRoomMessage',
        (message: MessageReceived, id: string) => {
          this.roomMessageReceived(message, id);
        }
      );
      console.log('connected');
    } catch (err) {
      console.log(err);
      setTimeout(() => this.start(), 5000);
    }
  }

  // Receive message and put them as the next value in the river //
  private mapReceivedMessage(message: MessageReceived): void {
    this.receivedMessageObject = message;
    this.sharedObj.next(this.receivedMessageObject);
  }

  // Get the user that connects
  private singleUserConnected(user: ConnectedUsers) {
    this.singleUser = user;
    this.sharedSingle.next(this.singleUser);
  }

  private addingRoom(room: Rooms) {
    this.roomAdded = room;
    this.sharedRooms.next(this.roomAdded);
  }

  private roomMessageReceived(message: MessageReceived, id: string) {
    this.roomMessage = message;
    this.sharedRoomMessage.next({ ...this.roomMessage, id: id });
  }

  private userJoinedRoom(user: MongoUsers) {
    this.userJoinRoom = user;
    this.sharedUsersInRoom.next(this.userJoinRoom);
  }

  // Get all the users and put them as the next value in the river if someone connects
  private usersConnecting(users: ConnectedUsers[]) {
    this.usersConnected = users;
    this.sharedUsers.next(this.usersConnected);
  }

  private newPrivateMessage(message: any) {
    this.privateMessageOnline = message;
    this.sharedPrivateMessageOnline.next(this.privateMessageOnline);
  }

  /* ****************************** Public Methods **************************************** */

  // Calls the controller method
  public GetMessage() {
    return this.http.get(`${this.URL}/chat/public`);
  }

  public broadcastMessage(msgDto: any) {
    this.http
      .post(this.POST_URL, msgDto)
      .subscribe((data) => console.log(data));
    // this.connection.invoke("SendMessage1", msgDto.user, msgDto.msgText).catch(err => console.error(err));    // This can invoke the server method named as "SendMethod1" directly.
  }

  // Share the data received from the backend, with other components in the project. , transform values into observable to be consumed
  public retrieveMappedObject(): Observable<MessageReceived> {
    return this.sharedObj.asObservable();
  }

  public retrieveSingleUser(): Observable<ConnectedUsers> {
    return this.sharedSingle.asObservable();
  }

  public retrieveUsers(): Observable<ConnectedUsers[]> {
    return this.sharedUsers.asObservable();
  }

  public retrieveRoom(): Observable<Rooms> {
    return this.sharedRooms.asObservable();
  }

  public retrieveNewMessage(): Observable<MessageReceived> {
    return this.sharedRoomMessage.asObservable();
  }

  public removeUser(): Observable<MongoUsers> {
    return this.removedUsers.asObservable();
  }

  public removeUserInRoom(): Observable<MongoUsers> {
    return this.removedUsersInRoom.asObservable();
  }

  public retrieveUsersInRoom(): Observable<MongoUsers> {
    return this.sharedUsersInRoom.asObservable();
  }

  public newPrivateMess(): Observable<MessageReceived> {
    return this.sharedPrivateMessageOnline.asObservable();
  }

  public disconnectUser() {
    if (this.connection) {
      this.connection.stop();
    }
  }

  // Charlotte's API
  GetAllUserMongo() {
    return this.http.get(`${this.URL}/account`);
  }

  GetSingleMongoUser(id) {
    return this.http.get(`${this.URL}/account/${id}`);
  }

  CreateAccount(body) {
    return this.http.post(`${this.URL}/account`, body, {
      observe: 'response',
    });
  }

  Log(body) {
    return this.http.get(`${this.URL}/account/login/${body}`, {
      observe: 'response',
    });
  }

  GetAllRoom() {
    return this.http.get(`${this.URL}/chat/room`);
  }

  GetSingleRoom(roomId) {
    return this.http.get(`${this.URL}/chat/room/${roomId}`);
  }

  AddRoom(body) {
    return this.http.post(`${this.URL}/chat/room/new`, body);
  }

  joinRoom(roomId, body) {
    return this.http.post(`${this.URL}/chat/room/${roomId}/join`, body);
  }

  sendMessageRoom(roomId, body) {
    return this.http.post(`${this.URL}/chat/room/${roomId}/send`, body);
  }

  leaveRoom(roomId, userId) {
    return this.http.delete(`${this.URL}/chat/room/${roomId}/users/${userId}`);
  }

  addContact(ownerId, body) {
    return this.http.post(`${this.URL}/chat/private/${ownerId}/new`, body);
  }
  sendPrivateMessage(receiverId, body) {
    return this.http.post(`${this.URL}/chat/private/${receiverId}/send`, body);
  }

  observeToken(): Observable<string> {
    return merge(
      of(this.LocalStorageService.retrieve('mongoID')),
      this.LocalStorageService.observe('mongoID')
    );
  }

  isAuthenticated(): Observable<boolean> {
    return this.observeToken().pipe(map((result) => !!result));
  }
}

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/Models/ResponseObj/User';
import { ChatService } from 'src/app/Services/chat.service';
import { Room } from '../../../../Models/ResponseObj/Room';
import { RoomService } from 'src/app/Services/room.service';
import { RoomListObject } from 'src/app/Models/ResponseObj/RoomListObject';
import { JoinRoomForm } from 'src/app/Models/RequestObj/JoinRoomForm';
import { AddNewRoomModalComponent } from '../add-new-room-modal/add-new-room-modal.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-room-modal',
  templateUrl: './add-room-modal.component.html',
  styleUrls: ['./add-room-modal.component.css']
})
export class AddRoomModalComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];

  public rooms: RoomListObject[];

  @Input() currentUser: User;

  @Output() emitData = new EventEmitter();

  constructor(private roomService: RoomService,
    private modalService: NgbModal,
    public modal: NgbActiveModal,
    private chatService: ChatService) { }

  ngOnInit(): void {
    this.subscriptions.push(this.loadRoomList());
    this.subscriptions.push(this.chatService.retrieveMappedNewRoom().subscribe(
      (receivedRoom: RoomListObject) => {
        console.log(`ReceivedNewRoom : ${JSON.stringify(receivedRoom)}`)
        this.addToRoomList(receivedRoom);}));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  loadRoomList(): Subscription {
    return this.roomService.getRooms().subscribe(
      (data: RoomListObject[]) => {
        this.rooms = data;
        console.log(this.rooms);
      },
      error => {
        console.log(error);
      }
    );
  }

  onShowNewRoomModal(){
    this.modalService.open(AddNewRoomModalComponent);
  }

  onJoinRoom(room: RoomListObject){
    let joinRoom: JoinRoomForm = {
      roomName: room.roomName,
      userId: this.currentUser.id,
      username: this.currentUser.username
    };

    this.chatService.joinRoom(room.id, joinRoom);
  }

  addToRoomList(obj: RoomListObject){
    let newObj = new RoomListObject();
    newObj.id = obj.id;
    newObj.roomName = obj.roomName;
    this.rooms.push(newObj);
  }
}

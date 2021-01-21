import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Contact } from 'src/app/Models/ResponseObj/Contact';
import { Room } from 'src/app/Models/ResponseObj/Room';
import { User } from 'src/app/Models/ResponseObj/User';
import { AddContactModalComponent } from '../add-contact-modal/add-contact-modal.component';
import { AddRoomModalComponent } from '../add-room-modal/add-room-modal.component';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { ChatService } from 'src/app/Services/chat.service';
import { CurrentUserService } from 'src/app/Services/current-user.service';
import { RoomListObject } from 'src/app/Models/ResponseObj/RoomListObject';
import { RoomInUserObject } from 'src/app/Models/ResponseObj/RoomInUserObject';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-sidebar',
  templateUrl: './user-sidebar.component.html',
  styleUrls: ['./user-sidebar.component.css']
})
export class UserSidebarComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];

  @Input() user: User;

  @Output() contactEvent: EventEmitter<Contact> = new EventEmitter<Contact>();
  @Output() roomEvent: EventEmitter<RoomInUserObject> = new EventEmitter<RoomInUserObject>();

  currentContact: Contact;
  currentRoom: RoomInUserObject;

  faUserPlus = faUserPlus;

  constructor(
    private modalService: NgbModal,
    private chatService: ChatService) { }

  ngOnInit(): void {
    this.subscriptions.push(this.chatService.retrieveMappedJoinRoom().subscribe(
      (receivedRoom: RoomInUserObject) => {
        console.log(`ReceivedJoinRoom : ${JSON.stringify(receivedRoom)}`)
        this.addToRoom(receivedRoom);}));
    this.subscriptions.push(this.chatService.retrieveMappedContact().subscribe(
      (receivedContact: Contact) => {
        console.log(`ReceivedContact : ${JSON.stringify(receivedContact)}`)
        this.addToContact(receivedContact);}));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  onCurrentContactChange(contact) {
    this.currentContact = contact;
    this.contactEvent.emit(this.currentContact);
    console.log(this.currentContact)
  }

  onCurrentRoomChange(room) {
    this.currentRoom = room;
    this.roomEvent.emit(this.currentRoom);
    console.log(this.currentRoom)
  }

  showContactModal(){
    const ref = this.modalService.open(AddContactModalComponent);
    ref.componentInstance.currentUser = this.user;
  }

  showRoomModal(){
    const ref = this.modalService.open(AddRoomModalComponent);
    ref.componentInstance.currentUser = this.user;
  }

  addToContact(obj: Contact){
    let newObj = new Contact();
    newObj.contactName = obj.contactName;
    newObj.messages = obj.messages;
    this.user.contacts.push(newObj);
  }

  addToRoom(obj: RoomInUserObject){
    let newObj = new RoomInUserObject();
    newObj.id = obj.id;
    newObj.roomId = obj.roomId;
    newObj.roomName = obj.roomName;
    this.user.rooms.push(newObj);
  }
}

import { Component, Input, OnInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Contact } from 'src/app/Models/ResponseObj/Contact';
import { Message } from 'src/app/Models/ResponseObj/Message';
import { MessageForm } from 'src/app/Models/RequestObj/MessageForm';
import { Room } from 'src/app/Models/ResponseObj/Room';
import { User } from 'src/app/Models/ResponseObj/User';
import { RoomInUserObject } from 'src/app/Models/ResponseObj/RoomInUserObject';
import { ChatService } from 'src/app/Services/chat.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat-inbox',
  templateUrl: './chat-inbox.component.html',
  styleUrls: ['./chat-inbox.component.css']
})
export class ChatInboxComponent implements OnInit, OnChanges, OnDestroy {

  @Input() user: User;

  isPublic: boolean = true;
  isGroup: boolean = false;
  isPrivate: boolean = false;

  @Input() currentContact: Contact = null;
  @Input() currentRoom: RoomInUserObject = null;

  selectedContact: Contact;
  selectedRoom: RoomInUserObject;

  private subscriptions: Subscription[] = [];

  messageInput;
  contactMessage: MessageForm;
  msg: Message = new Message();
  publicMessage: MessageForm;
  loggedUsername: string;
  contactMessages: Message[] = [];
  publicMessages: Message[] = [];
  contactName: string;
  groupMessage: MessageForm;
  groupMessages: Message[] = [];

  constructor(
    private chatService: ChatService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.subscriptions.push(this.chatService.retrieveMappedPublicMessage().subscribe( (receivedMessage: Message) =>
      this.addToPublicInbox(receivedMessage)));
    this.subscriptions.push(this.chatService.retrieveMappedRoomMessage().subscribe( (receivedMessage: Message) =>
      this.addToGroupInbox(receivedMessage)));
    this.subscriptions.push(this.chatService.retrieveMappedPrivateMessage().subscribe( (receivedMessage: Message) =>
      this.addToPrivateInbox(receivedMessage)));
  }

  ngOnChanges(changes: SimpleChanges) {
    // only run when properties "current...." changed
    if (changes['currentContact']) {
      if(this.currentContact != null) {
        this.selectedContact = this.currentContact;
        this.mapInboxType('private');
      }
    }
    if (changes['currentRoom']) {
      if(this.currentRoom != null) {
        this.selectedRoom = this.currentRoom;
        this.mapInboxType('group');
      }
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  createForm() {
    this.messageInput = this.formBuilder.group({
        Message: new FormControl('', Validators.required)
    });
  }

  mapInboxType(inboxType: string){
    if(inboxType == 'public'){
      this.isPublic=true;
      this.isGroup=false;
      this.isPrivate=false;
    }
    else if(inboxType == 'group')
    {
      this.isGroup=true;
      this.isPublic=false;
      this.isPrivate=false;
    }
    else if(inboxType == 'private')
    {
      this.isPrivate=true;
      this.isPublic=false;
      this.isGroup=false;
    }
    else{
      console.error("Wrong Type Input")
    }
  }

  onSubmitPrivateMessage() {
    if (this.messageInput.invalid) {
        return;
    }
    let messageContent = this.messageInput.value;
    this.contactMessage = {
      senderId: this.user.id,
      senderName: this.user.username,
      content: messageContent.Message
    }
    this.chatService.broadcastPrivateMessage(this.selectedContact.contactId, this.contactMessage);
    this.msg.content = "";
  }

  onSubmitPublicMessage(){
    if (this.messageInput.invalid) {
      return;
    }
    let messageContent = this.messageInput.value;
    this.publicMessage = {
      senderId: this.user.id,
      senderName: this.user.username,
      content: messageContent.Message
    }
    this.chatService.broadcastPublicMessage(this.publicMessage);
    this.msg.content = "";
  }

  onSubmitGroupMessage(){
    if (this.messageInput.invalid) {
      return;
    }
    let messageContent = this.messageInput.value;
    this.groupMessage = {
      senderId: this.user.id,
      senderName: this.user.username,
      content: messageContent.Message
    }
    console.log(this.selectedRoom.roomId)
    this.chatService.broadcastRoomMessage(this.selectedRoom.roomId, this.groupMessage);
    this.msg.content = "";
  }

  addToPrivateInbox(obj: Message) {
    let newObj = new Message();
    newObj.id = obj.id,
    newObj.senderId = obj.senderId,
    newObj.senderName = obj.senderName;
    newObj.content = obj.content;
    this.contactMessages.push(newObj);
  }

  addToPublicInbox(obj: Message){
    let newObj = new Message();
    newObj.id = obj.id,
    newObj.senderId = obj.senderId,
    newObj.senderName = obj.senderName;
    newObj.content = obj.content;
    this.publicMessages.push(newObj);
  }

  addToGroupInbox(obj: Message){
    let newObj = new Message();
    newObj.id = obj.id,
    newObj.senderId = obj.senderId,
    newObj.senderName = obj.senderName;
    newObj.content = obj.content;
    this.groupMessages.push(newObj);
  }
}

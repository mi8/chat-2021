import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NewRoomForm } from 'src/app/Models/RequestObj/NewRoomForm';
import { ChatService } from 'src/app/Services/chat.service';

@Component({
  selector: 'app-add-new-room-modal',
  templateUrl: './add-new-room-modal.component.html',
  styleUrls: ['./add-new-room-modal.component.css']
})
export class AddNewRoomModalComponent implements OnInit {

  createRoomForm;
  isSubmitted: boolean;
  isLoading: boolean;

  constructor(private formBuilder: FormBuilder,
    private chatService: ChatService,
    public modal: NgbActiveModal) { }

  ngOnInit(): void {
    this.createNewRoomForm();
    this.isSubmitted = false;
  }

  createNewRoomForm() {
    this.createRoomForm = this.formBuilder.group({
      RoomName: new FormControl('', Validators.required)
    });
  }

  onCreateRoom(){
    this.isSubmitted = true;
    let newRoom: NewRoomForm = {
      roomName: this.createRoomForm.value.RoomName
    };
    this.isLoading = true;
    this.chatService.broadcastNewRoom(newRoom);
    this.resetCreateRoomForm();
    this.isLoading = false;
  }

  resetCreateRoomForm() {
    this.createRoomForm.setValue({
      RoomName: null
    });
  }
}

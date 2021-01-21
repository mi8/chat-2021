import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/Models/ResponseObj/User';
import { UserService } from 'src/app/Services/user.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-get-user-profile-modal',
  templateUrl: './get-user-profile-modal.component.html',
  styleUrls: ['./get-user-profile-modal.component.css']
})
export class GetUserProfileModalComponent implements OnInit {

  public currentUser: User;

  editForm;
  isLoading = false;
  selectecUser: User;

  constructor(private userService: UserService,
    public modal: NgbActiveModal,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.setForm()
  }

  onUpdateProfile() {
    if (this.editForm.invalid || this.isLoading) {
      return;
    }
    this.isLoading = true;
    this.modal.close('Yes')
  }

  onCancel(){
    this.modal.dismiss('Cancel Button');
  }

  get editFormData() { return this.editForm.controls; }

  private setForm() {
    this.editForm = this.formBuilder.group({
      Username: [this.currentUser.username, Validators.required],
      Password: [this.currentUser.password, Validators.required],
      FirstName: [this.currentUser.firstName, Validators.required],
      LastName: [this.currentUser.lastName, Validators.required]
    });
  }

  //To do
  onDeleteUser(){

  }
}

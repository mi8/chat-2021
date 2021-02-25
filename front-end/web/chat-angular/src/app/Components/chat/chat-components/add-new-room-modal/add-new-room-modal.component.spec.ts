import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddNewRoomModalComponent } from './add-new-room-modal.component';

describe('AddNewRoomModalComponent', () => {
  let component: AddNewRoomModalComponent;
  let fixture: ComponentFixture<AddNewRoomModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewRoomModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewRoomModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

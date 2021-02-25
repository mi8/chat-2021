import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GetUserProfileModalComponent } from './get-user-profile-modal.component';

describe('GetUserProfileModalComponent', () => {
  let component: GetUserProfileModalComponent;
  let fixture: ComponentFixture<GetUserProfileModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GetUserProfileModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetUserProfileModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

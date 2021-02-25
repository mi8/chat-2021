import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ChatInboxComponent } from './chat-inbox.component';

describe('ChatInboxComponent', () => {
  let component: ChatInboxComponent;
  let fixture: ComponentFixture<ChatInboxComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatInboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatInboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

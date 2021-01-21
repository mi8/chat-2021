import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersNotFoundComponent } from './users-not-found.component';

describe('UsersNotFoundComponent', () => {
  let component: UsersNotFoundComponent;
  let fixture: ComponentFixture<UsersNotFoundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersNotFoundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersNotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskNotFoundComponent } from './task-not-found.component';

describe('TaskNotFoundComponent', () => {
  let component: TaskNotFoundComponent;
  let fixture: ComponentFixture<TaskNotFoundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskNotFoundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskNotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

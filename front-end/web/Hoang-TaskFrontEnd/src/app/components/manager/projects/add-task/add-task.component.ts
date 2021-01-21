import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],
})
export class AddTaskComponent implements OnInit {
  AddTask: FormGroup;
  id: number;
  clicked: boolean = false;

  constructor(
    private projectService: ProjectService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params.id;
    this.AddTask = new FormGroup({
      description: new FormControl('', [
        Validators.required,
        Validators.maxLength(100),
      ]),
      importance: new FormControl(false),
    });
  }

  sendTask(task) {
    this.clicked = true;
    this.projectService
      .addTask(this.id, task)
      .pipe(take(1))
      .subscribe((data) => {
        this.router.navigate(['..'], { relativeTo: this.route });
      });
  }
}

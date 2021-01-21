import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.scss'],
})
export class AddProjectComponent implements OnInit {
  AddProject: FormGroup;
  clicked: boolean = false;

  constructor(private projectService: ProjectService, private router: Router) {}

  ngOnInit(): void {
    this.AddProject = new FormGroup({
      title: new FormControl('', [
        Validators.required,
        Validators.maxLength(20),
      ]),
      description: new FormControl('', [Validators.required,Validators.maxLength(620)]),
    });
  }

  sendProject(project) {
    this.projectService
      .addProject(project)
      .pipe(take(1))
      .subscribe((res) => {
        this.clicked = true;
        this.router.navigate(['/projects']);
      });
  }
}

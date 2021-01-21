import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { Project } from 'src/app/Models/Project';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.scss'],
})
export class EditProjectComponent implements OnInit {
  EditProject: FormGroup;
  Project: Project;
  clicked: boolean = false;
  id: number;
  constructor(
    private projectService: ProjectService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params.id;
    this.projectService.getOneProject(this.id).subscribe((project: Project) => {
      this.EditProject = new FormGroup({
        title: new FormControl(project.title, [
          Validators.required,
          Validators.maxLength(20),
        ]),
        description: new FormControl(project.description, [
          Validators.required,
          Validators.maxLength(620),
        ]),
      });
    });
  }

  sendProject(project) {
    let updatedProject = {
      title: project.title.trim(),
      description: project.description.trim(),
    };
    this.clicked = true;
    this.projectService
      .editProject(this.id, updatedProject)
      .pipe(take(1))
      .subscribe((res) => {
        this.router.navigate(['/projects', this.id]);
      });
  }
}

import { Component, OnInit } from '@angular/core';
import { ProjectService } from 'src/app/services/project.service';
import { Project } from 'src/app/Models/Project';
import { take, tap } from 'rxjs/operators';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements OnInit {
  loading: boolean;
  projects: Project[];

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.projectService
      .getAllProjects()
      .pipe(take(1))
      .subscribe((projects: Project[]) => {
        this.projects = projects;
        this.loading = false;
      });
  }

  deleteProject(element) {
    this.projectService
      .deleteProject(element.id)
      .pipe(
        take(1),
        tap(() => {
          this.loading = true;
        })
      )
      .subscribe((res) => {
        setTimeout(() => {
          this.loading = false;
        }, 200);
        this.projects = this.projects.filter(
          (projects) => projects.id != element.id
        );
      });
  }
}

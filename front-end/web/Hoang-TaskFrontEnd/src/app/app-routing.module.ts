import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignInFormComponent } from './components/authentication/sign-in-form/sign-in-form.component';
import { RegisterFormComponent } from './components/authentication/register-form/register-form.component';
import { MainComponent } from './components/manager/users/main/main.component';
import { ProfilePageComponent } from './components/users/profile-page/profile-page.component';
import { UpdateProfileComponent } from './components/users/update-profile/update-profile.component';
import { TasksComponent } from './components/users/tasks/tasks.component';
import { UserDetailsComponent } from './components/manager/users/user-details/user-details.component';
import { UserTasksComponent } from './components/manager/users/user-tasks/user-tasks.component';
import { AdminPrivileges } from './guard/can-activate.guard';
import { AuthenticationGuard } from './guard/authentication.guard';
import { NotFoundComponent } from './components/errorsPages/not-found/not-found.component';
import { UsersNotFoundComponent } from './components/errorsPages/users-not-found/users-not-found.component';
import { TaskNotFoundComponent } from './components/errorsPages/task-not-found/task-not-found.component';
import { ServerDownComponent } from './components/errorsPages/server-down/server-down.component';
import { NoPrivilegesComponent } from './components/errorsPages/no-privileges/no-privileges.component';
import { ProjectsComponent } from './components/manager/projects/allProjects/projects.component';
import { ProjectDetailsComponent } from './components/manager/projects/project-details/project-details.component';
import { AddProjectComponent } from './components/manager/projects/add-project/add-project.component';
import { AddTaskComponent } from './components/manager/projects/add-task/add-task.component';
import { AssignUserComponent } from './components/manager/projects/assign-user/assign-user.component';
import { EditProjectComponent } from './components/manager/projects/edit-project/edit-project.component';
import { ListComponent } from './components/users/projects/list/list.component';
import { TasksListComponent } from './components/users/projects/tasks-list/tasks-list.component';
import { ChartComponent } from './components/users/chart/chart.component';
import { UsersDataComponent } from './components/manager/users/users-data/users-data.component';
import { KanbanComponent } from './components/manager/projects/kanban/kanban.component';
import { ChatComponent } from './components/users/chat/chat.component';
import { RoomComponent } from './components/users/chat/room/room.component';
import { OneononeComponent } from './components/users/chat/oneonone/oneonone.component';

const routes: Routes = [
  { path: '', redirectTo: 'signin', pathMatch: 'full' },
  { path: 'signin', component: SignInFormComponent },
  { path: 'register', component: RegisterFormComponent },
  { path: 'users', component: MainComponent, canActivate: [AdminPrivileges] },
  {
    path: 'users/charts',
    component: UsersDataComponent,
    canActivate: [AdminPrivileges],
  },
  {
    path: 'chart/:id',
    component: ChartComponent,
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'profile',
    component: ProfilePageComponent,
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'update',
    component: UpdateProfileComponent,
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'chat',
    component: ChatComponent,
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'chat/room/:id',
    component: RoomComponent,
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'chat/user/:id',
    component: OneononeComponent,
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'projects',
    component: ProjectsComponent,
    canActivate: [AdminPrivileges],
  },
  {
    path: 'projects/add',
    component: AddProjectComponent,
    canActivate: [AdminPrivileges],
  },
  {
    path: 'projects/:id',
    component: ProjectDetailsComponent,
    canActivate: [AdminPrivileges],
  },
  {
    path: 'projects/:id/kanban',
    component: KanbanComponent,
    canActivate: [AdminPrivileges],
  },
  {
    path: 'projects/:id/edit',
    component: EditProjectComponent,
    canActivate: [AdminPrivileges],
  },
  {
    path: 'projects/:id/add',
    component: AddTaskComponent,
    canActivate: [AdminPrivileges],
  },
  {
    path: 'projects/:id/tasks/:taskId',
    component: AssignUserComponent,
    canActivate: [AdminPrivileges],
  },
  {
    path: 'assignTasks',
    component: ListComponent,
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'assignTasks/:id',
    component: TasksListComponent,
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'tasks',
    component: TasksComponent,
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'manage/users/:id',
    component: UserDetailsComponent,
    canActivate: [AdminPrivileges],
  },
  {
    path: 'manage/users/:id/tasks',
    component: UserTasksComponent,
    canActivate: [AdminPrivileges],
  },
  { path: '404', component: UsersNotFoundComponent },
  { path: 'NoTask', component: TaskNotFoundComponent },
  { path: 'DeadServer', component: ServerDownComponent },
  { path: 'NoPrivileges', component: NoPrivilegesComponent },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

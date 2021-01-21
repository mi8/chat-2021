import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/global/navbar/navbar.component';
import { SignInFormComponent } from './components/authentication/sign-in-form/sign-in-form.component';
import { RegisterFormComponent } from './components/authentication/register-form/register-form.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import {
  NavbarModule,
  WavesModule,
  ButtonsModule,
  TableModule,
} from 'angular-bootstrap-md';
import { MainComponent } from './components/manager/users/main/main.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { BearerTokenInterceptor } from './services/bearer-token.interceptor';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { ProfilePageComponent } from './components/users/profile-page/profile-page.component';
import { UpdateProfileComponent } from './components/users/update-profile/update-profile.component';
import { TasksComponent } from './components/users/tasks/tasks.component';
import { UserDetailsComponent } from './components/manager/users/user-details/user-details.component';
import { UserTasksComponent } from './components/manager/users/user-tasks/user-tasks.component';
import { NotFoundComponent } from './components/errorsPages/not-found/not-found.component';
import { UsersNotFoundComponent } from './components/errorsPages/users-not-found/users-not-found.component';
import { TaskNotFoundComponent } from './components/errorsPages/task-not-found/task-not-found.component';
import { ServerDownComponent } from './components/errorsPages/server-down/server-down.component';
import { NoPrivilegesComponent } from './components/errorsPages/no-privileges/no-privileges.component';
import { SpinnerComponent } from './components/global/spinner/spinner.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ProjectsComponent } from './components/manager/projects/allProjects/projects.component';
import { ProjectDetailsComponent } from './components/manager/projects/project-details/project-details.component';
import { AddProjectComponent } from './components/manager/projects/add-project/add-project.component';
import { AddTaskComponent } from './components/manager/projects/add-task/add-task.component';
import { AssignUserComponent } from './components/manager/projects/assign-user/assign-user.component';
import { EditProjectComponent } from './components/manager/projects/edit-project/edit-project.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ListComponent } from './components/users/projects/list/list.component';
import { TasksListComponent } from './components/users/projects/tasks-list/tasks-list.component';
import { ChartComponent } from './components/users/chart/chart.component';
import { UsersDataComponent } from './components/manager/users/users-data/users-data.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { KanbanComponent } from './components/manager/projects/kanban/kanban.component';
import { ChatComponent } from './components/users/chat/chat.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { RoomComponent } from './components/users/chat/room/room.component';
import { MatInputModule } from '@angular/material/input';
import { OneononeComponent } from './components/users/chat/oneonone/oneonone.component';
import { MsalModule } from '@azure/msal-angular';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SignInFormComponent,
    RegisterFormComponent,
    MainComponent,
    ProfilePageComponent,
    UpdateProfileComponent,
    TasksComponent,
    UserDetailsComponent,
    UserTasksComponent,
    NotFoundComponent,
    UsersNotFoundComponent,
    TaskNotFoundComponent,
    ServerDownComponent,
    NoPrivilegesComponent,
    SpinnerComponent,
    ProjectsComponent,
    ProjectDetailsComponent,
    AddProjectComponent,
    AddTaskComponent,
    AssignUserComponent,
    EditProjectComponent,
    ListComponent,
    TasksListComponent,
    ChartComponent,
    UsersDataComponent,
    KanbanComponent,
    ChatComponent,
    RoomComponent,
    OneononeComponent,
  ],
  imports: [
    BrowserModule,
    NgxSkeletonLoaderModule,
    MDBBootstrapModule.forRoot(),
    NavbarModule,
    WavesModule.forRoot(),
    ButtonsModule.forRoot(),
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    TableModule,
    NgxSpinnerModule,
    BrowserAnimationsModule,
    NgxWebstorageModule.forRoot(),
    DragDropModule,
    MatInputModule,
    MsalModule.forRoot(
      {
        auth: {
          clientId: '52810140-36e8-4d31-a3c2-243a5aa3a389',
          authority:
            'https://AuthASPAngular.b2clogin.com/AuthASPAngular.onmicrosoft.com/B2C_1_SignInOnly',
          validateAuthority: false,
          // redirectUri: 'https://taskmanagerchatapplication.azurewebsites.net',
        },
        cache: {
          cacheLocation: 'localStorage',
          storeAuthStateInCookie: false,
        },
      },
      {
        consentScopes: ['user.read', 'openid', 'profile'],
      }
    ),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BearerTokenInterceptor,
      multi: true,
    },
    // add # to urls to allow you to refresh
    { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

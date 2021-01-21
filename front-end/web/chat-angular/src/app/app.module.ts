import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppComponent } from './app.component';
import { HomeComponent } from './Components/home/home.component';

import { ChatComponent } from './Components/chat/chat.component';
import { ChatInboxComponent } from './Components/chat/chat-components/chat-inbox/chat-inbox.component';
import { UserSidebarComponent } from './Components/chat/chat-components/user-sidebar/user-sidebar.component';
import { NavbarComponent } from './Components/shared/navbar/navbar.component';

import { GetUserProfileModalComponent } from './Components/chat/chat-components/get-user-profile-modal/get-user-profile-modal.component';
import { AddRoomModalComponent } from './Components/chat/chat-components/add-room-modal/add-room-modal.component';
import { AddContactModalComponent } from './Components/chat/chat-components/add-contact-modal/add-contact-modal.component';

import { ChatService } from './Services/chat.service';
import { UserService } from './Services/user.service';
import { RoomService } from './Services/room.service';
import { PublicService } from './Services/public.service';
import { CurrentUserService } from './Services/current-user.service';
import { msalConfig, msalAngularConfig } from './app-config';
import { AddNewRoomModalComponent } from './Components/chat/chat-components/add-new-room-modal/add-new-room-modal.component';
import { Configuration } from 'msal';
import {	  MsalModule,	  MsalInterceptor,	  MSAL_CONFIG,	  MSAL_CONFIG_ANGULAR,	  MsalService,	  MsalAngularConfiguration	} from '@azure/msal-angular';
import { AboutComponent } from './Components/about/about.component';

function MSALConfigFactory(): Configuration {	  return msalConfig;	}
function MSALAngularConfigFactory(): MsalAngularConfiguration {	  return msalAngularConfig;	}

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    HomeComponent,
    AddContactModalComponent,
    GetUserProfileModalComponent,
    ChatInboxComponent,
    UserSidebarComponent,
    NavbarComponent,
    AddRoomModalComponent,
    AddNewRoomModalComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    FontAwesomeModule,
    MsalModule
  ],
  entryComponents:[
    AddContactModalComponent
  ],
  providers: [
    ChatService,
    UserService,
    RoomService,
    PublicService,
    CurrentUserService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    },
    {
      provide: MSAL_CONFIG,
      useFactory: MSALConfigFactory
    },
    {
      provide: MSAL_CONFIG_ANGULAR,
      useFactory: MSALAngularConfigFactory
    },
    MsalService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

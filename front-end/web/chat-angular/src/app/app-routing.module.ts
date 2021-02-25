import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { ChatComponent } from './Components/chat/chat.component';
import { HomeComponent } from './Components/home/home.component';
import { AuthGuard } from './Services/auth.guard';
import { AboutComponent } from './Components/about/about.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent},
  { path: 'chat', component: ChatComponent, canActivate: [AuthGuard, MsalGuard]},
  { path: '', redirectTo: 'home', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

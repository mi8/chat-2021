import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ChatService } from 'src/app/services/chat.service';
import { MsalService } from '@azure/msal-angular';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  animations: [],
})
export class NavbarComponent implements OnInit {
  Links: any[] = [
    { name: 'Manage', link: '/projects' },
    { name: 'Users', link: '/users' },
    { name: 'Projects', link: '/assignTasks' },
    { name: 'Tasks', link: '/tasks' },
    { name: 'Profile', link: '/profile' },
    { name: 'Chat', link: '/chat' },
    { name: 'Update', link: '/update' },
  ];

  toSearch: any[] = [
    { name: 'Manage', link: '/projects' },
    { name: 'Users', link: '/users' },
    { name: 'Projects', link: '/assignTasks' },
    { name: 'Tasks', link: '/tasks' },
    { name: 'Profile', link: '/profile' },
    { name: 'Chat', link: '/chat' },
    { name: 'Update', link: '/update' },
  ];

  display: boolean = false;

  authenticated: Observable<boolean> = this.auth.isAuthenticated();
  isAdminObs: Observable<boolean> = this.auth.isAdmin();

  constructor(
    private auth: AuthService,
    private router: Router,
    private ChatService: ChatService,
    private azureLogin: MsalService
  ) {}

  ngOnInit(): void {}

  logout() {
    this.auth.logout();
    this.ChatService.disconnectUser();
    setTimeout(() => {
      this.azureLogin.logout()
    }, 200);
  }

  searchValue(el) {
    let valueToSearch = el.toLocaleLowerCase().trim();
    setTimeout(() => {
      let newTable = this.Links.filter((x) =>
        x.name.toLocaleLowerCase().includes(valueToSearch)
      );
      this.toSearch = newTable;
    }, 500);
  }

  select(el) {
    this.router.navigate([el.link]);
  }
}

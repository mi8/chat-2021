import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { CurrentUserService } from './current-user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router,
    private currentUserService: CurrentUserService){}

  canActivate() {
    if (this.currentUserService.currentUserValue) {
        return true;
    }

    this.router.navigate(['/home']);
    return false;
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CurrentUser } from '../Models/LocalObj/CurrentUser';
import { User } from '../Models/ResponseObj/User';

const currentUserString: string = 'currentUser';

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {

  private currentUserSubject: BehaviorSubject<CurrentUser>;
  public currentUser: Observable<CurrentUser>;

  constructor() {
    this.currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): CurrentUser {
    return this.currentUserSubject.value;
  }

  login(user: User) {
    let setUser: CurrentUser = {
      id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName
    };
    localStorage.setItem(currentUserString, JSON.stringify(setUser));
    this.currentUserSubject.next(setUser);
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}

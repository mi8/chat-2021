import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserRegister } from '../Models/RequestObj/UserRegister';
import { User } from '../Models/ResponseObj/User';
import { UserListObject } from '../Models/ResponseObj/UserListObject';
import { environment } from '../../environments/environment.prod';

const BASE_URL = `${environment.apiBaseUrl}api/account/`;

const HTTP_OPTIONS = { headers: new HttpHeaders({ 'Content-Type': 'application/json' })};

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private _http: HttpClient) { }

  getUsers(): Observable<UserListObject[]> {
    return this._http.get<UserListObject[]>(BASE_URL, HTTP_OPTIONS);
  }

  getUserById(userId: string): Observable<User> {
    return this._http.get<User>(BASE_URL + userId, HTTP_OPTIONS);
  }

  login(username: string): Observable<User> {
    return this._http.get<User>(BASE_URL + 'login/' + username, HTTP_OPTIONS);
  }

  register(registerForm: UserRegister): Observable<User> {
    return this._http.post<User>(BASE_URL, registerForm, HTTP_OPTIONS);
  }
  //To do
  updateUser(userId: string, user: User): Observable<User> {
    return this._http.put<User>(BASE_URL + userId, user, HTTP_OPTIONS);
  }
  //To do
  deleteUser(userId: string) {
    return this._http.delete(BASE_URL + userId, HTTP_OPTIONS);
  }
}

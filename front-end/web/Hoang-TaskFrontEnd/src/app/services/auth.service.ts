import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { WebRequestService } from './web-request.service';
import { UserRegister } from '../Models/UserRegister';
import { map, shareReplay, tap } from 'rxjs/operators';
import { UserAuth } from '../Models/UserAuth';
import { BehaviorSubject, merge, Observable, of } from 'rxjs';
import { LocalStorageService } from 'ngx-webstorage';
import { UpdateUser } from '../Models/UpdateUser';
import { Task } from '../Models/Tasks';
import jwt_decode from 'jwt-decode';
import * as CryptoJS from 'crypto-js';
import { secret } from '../secrets/keys';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private admin: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private secret: string = secret;

  constructor(
    private webRequest: WebRequestService,
    private router: Router,
    private LocalStorageService: LocalStorageService
  ) {}

  observeToken(): Observable<string> {
    return merge(
      of(this.LocalStorageService.retrieve('token')),
      this.LocalStorageService.observe('token')
    );
  }

  // Always observe token and return that value
  // retrieve on refresh and then observe continously
  isAuthenticated(): Observable<boolean> {
    return this.observeToken().pipe(map((result) => !!result));
  }

  isAdmin(): Observable<boolean> {
    return this.observeToken().pipe(
      map((result) =>
        result &&
        this.getDecodedAccessToken(this.decrypt(result))?.role == 'Admin'
          ? true
          : false
      )
    );
  }

  // User
  getAllUsers() {
    return this.webRequest.getAllUsers('api/users');
  }

  getOne(id: number) {
    return this.webRequest.getOneUser(`api/users`, id).pipe(shareReplay());
  }

  editUser(id: number, data: Partial<UpdateUser>) {
    return this.webRequest
      .editUser(`api/users/${id}`, data)
      .pipe(shareReplay());
  }

  register(payload: UserRegister) {
    return this.webRequest.register(payload).pipe(
      shareReplay(),
      tap((res: HttpResponse<any>) => {
        //this.authenticated.next(true);
        this.setSession(res.body.token);
      })
    );
  }

  deleteUser(id: number) {
    return this.webRequest.deleteUser(`api/users/${id}`);
  }

  login(payload: UserAuth) {
    return this.webRequest.authenticate(payload).pipe(
      shareReplay(),
      tap((res: HttpResponse<any>) => {
        //this.authenticated.next(true);
        this.setSession(res.body.token);
      })
    );
  }

  // Tasks
  getAllTasks(id: number) {
    return this.webRequest.getAllTasks(`api/users/${id}/tasks`);
  }

  getOneTask(id: number, taskId: number) {
    return this.webRequest.getOneTask(`api/users/${id}/tasks/${taskId}`);
  }

  EditTask(id: number, taskId: number, payload: Task) {
    return this.webRequest
      .EditTasks(`api/users/${id}/tasks/${taskId}`, payload)
      .pipe(shareReplay());
  }

  DeleteTask(id: number, taskId: number) {
    return this.webRequest.DeleteTask(`api/users/${id}/tasks/${taskId}`);
  }

  logout() {
    this.removeSession();
  }

  //Helper Method //

  capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  getDecodedAccessToken(token: string): any {
    try {
      var decoded = jwt_decode(token);
      return decoded;
    } catch (Error) {
      return null;
    }
  }

  decrypt(token: string): string {
    if (token) {
      var bytes = CryptoJS.AES.decrypt(token, secret);
      var originalText = bytes.toString(CryptoJS.enc.Utf8);
      return originalText;
    }
  }

  decryptedAndDecodedToken() {
    var bytes = CryptoJS.AES.decrypt(
      this.LocalStorageService.retrieve('token'),
      secret
    );
    var originaltoken = bytes.toString(CryptoJS.enc.Utf8);
    let decoded = this.getDecodedAccessToken(originaltoken);
    return decoded;
  }

  private setSession(accessToken: string) {
    var ciphertext = CryptoJS.AES.encrypt(accessToken, secret).toString();
    this.LocalStorageService.store('token', ciphertext);
  }

  private removeSession() {
    this.LocalStorageService.clear('token');
    this.LocalStorageService.clear('mongoID');
    this.router.navigate(['signin']);
  }
}

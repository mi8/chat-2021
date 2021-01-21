import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Message } from '../Models/ResponseObj/Message';
import { environment } from '../../environments/environment.prod';

const BASE_URL = `${environment.apiBaseUrl}api/public/`;

const HTTP_OPTIONS = { headers: new HttpHeaders({ 'Content-Type': 'application/json' })};

@Injectable({
  providedIn: 'root'
})
export class PublicService {

  constructor(private _http: HttpClient) { }

  getPublicMessages(): Observable<Message[]> {
    return this._http.get<Message[]>(BASE_URL, HTTP_OPTIONS);
  }

  getPublicMessage(messageId: string): Observable<Message> {
    return this._http.get<Message>(BASE_URL + messageId, HTTP_OPTIONS);
  }
}

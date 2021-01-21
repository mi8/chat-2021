import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Room } from '../Models/ResponseObj/Room';
import { NewRoomForm } from '../Models/RequestObj/NewRoomForm';
import { RoomListObject } from '../Models/ResponseObj/RoomListObject';
import { MessageForm } from '../Models/RequestObj/MessageForm';
import { environment } from '../../environments/environment.prod';

const BASE_URL = `${environment.apiBaseUrl}api/chat/room/`;

const HTTP_OPTIONS = { headers: new HttpHeaders({ 'Content-Type': 'application/json' })};

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor(private _http: HttpClient) { }

  getRooms(): Observable<RoomListObject[]> {
    return this._http.get<RoomListObject[]>(BASE_URL, HTTP_OPTIONS);
  }

  getRoom(roomId: string): Observable<Room> {
    return this._http.get<Room>(BASE_URL + roomId, HTTP_OPTIONS);
  }
}

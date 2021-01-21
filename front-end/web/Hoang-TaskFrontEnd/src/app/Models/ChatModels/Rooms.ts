import { MessageReceived } from '../Messages';
import { RoomUsers } from './RoomUsers';
export interface Rooms {
  id?: string;
  roomName: string;
  roomUsers?: RoomUsers[];
  roomMessages?: MessageReceived[];
}

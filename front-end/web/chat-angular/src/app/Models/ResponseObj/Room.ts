import { Message } from './Message';
import { UserInRoomObject } from './UserInRoomObject';

export class Room {
  id: string;
  roomName: string;
  roomUsers: UserInRoomObject[];
  roomMessages: Message[];
}

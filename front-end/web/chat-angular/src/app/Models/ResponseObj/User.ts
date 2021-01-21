import { RoomInUserObject } from './RoomInUserObject';
import { Contact } from './Contact';

export class User {
  id: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  rooms: RoomInUserObject[];
  contacts: Contact[];
}

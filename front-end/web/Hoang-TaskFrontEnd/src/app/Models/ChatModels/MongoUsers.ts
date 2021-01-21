import { MessageReceived } from '../Messages';
import { Rooms } from './Rooms';
import { Contact } from './Contacts';
export interface MongoUsers {
  id: string;
  userId: string;
  username: string;
  rooms: Rooms[];
  contacts: Contact[];
}

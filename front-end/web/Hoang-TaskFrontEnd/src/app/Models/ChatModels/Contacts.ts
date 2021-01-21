import { MessageReceived } from '../Messages';
export interface Contact {
  contactName: string;
  contactId: string;
  messages: MessageReceived[];
}

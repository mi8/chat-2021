export interface MessageReceived {
  senderName: string;
  sentDate?: Date;
  content: string;
  senderId?: number;
  id?:string;
}

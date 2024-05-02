import { User } from "../User/user";

export class Message {
  id: number;
  sender: User;
  receiver: User;
  content: string;
  timestamp: Date | string;
  wasSeen: boolean;

  constructor(sender: User, receiver: User, content: string, timestamp: Date | string) {
    this.id = -1; 
    this.sender = sender;
    this.receiver = receiver;
    this.content = content;
    this.timestamp = timestamp;
    this.wasSeen = false;
  }
}
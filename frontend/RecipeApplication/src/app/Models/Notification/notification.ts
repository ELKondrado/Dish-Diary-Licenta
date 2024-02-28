import { User } from "../User/user";

export interface Notification {
    id: number;
    sender: User; 
    receiver: User; 
    type: string;
    status: string; 
    dateCreated: Date;
  }
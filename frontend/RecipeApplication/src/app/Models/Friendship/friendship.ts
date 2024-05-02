import { User } from "../User/user";

export interface Friendship{
   id: number;
   user: User;
   friend: User; 
   date: Date;
}

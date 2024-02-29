import { Message } from "../Message/message";
import { User } from "../User/user";

export interface Conversation {
    id: number;
    user1: User;
    user2: User;
    lastMessage: Message;
}

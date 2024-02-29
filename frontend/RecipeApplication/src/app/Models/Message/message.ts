import { User } from "../User/user";

export interface Message {
    id: number;
    sender: User;
    receiver: User;
    content: String;
    timestamp: Date | string;
    wasSeen: boolean;
}

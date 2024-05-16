import { User } from "../User/user";

export interface RepositoryDto{
    id: number;
    name: string;
    userOwner: User;
}

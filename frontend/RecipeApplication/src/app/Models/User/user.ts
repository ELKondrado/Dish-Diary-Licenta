import { Friendship } from "../Friendship/friendship";

export interface User{
    userId: number;
    userName: string;
    userPassword: string;
    userNickname: String;
    userEmail: String;
    profileImage: string;
    userBio: string;
    totalRecipes: number;
    totalRecipesCreated: number;
    totalRecipesAdded: number;
    recipeSent: boolean;
}

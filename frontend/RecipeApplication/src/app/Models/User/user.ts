import { Recipe } from "../Recipe/recipe";
import { Review } from "../Review/review";

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
}

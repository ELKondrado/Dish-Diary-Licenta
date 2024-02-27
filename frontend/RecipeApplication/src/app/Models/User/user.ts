import { Recipe } from "../Recipe/recipe";

export interface User{
    userId: number;
    userName: string;
    userPassword: string;
    profileImage: string;
    totalRecipes: number;
    totalRecipesCreated: number;
    totalRecipesAdded: number;
    recipes: Recipe[];
}

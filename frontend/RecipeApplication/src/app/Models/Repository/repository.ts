import { Recipe } from "../Recipe/recipe";
import { User } from "../User/user";

export interface Repository{
    id: number;
    name: string;
    userOwner: User;
    recipes: Recipe[]; 
    addedRecipe: boolean;
}

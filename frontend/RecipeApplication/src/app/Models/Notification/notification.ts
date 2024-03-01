import { Recipe } from "../Recipe/recipe";
import { User } from "../User/user";

export interface Notif {
    id: number;
    sender: User; 
    receiver: User; 
    type: string;
    status: string; 
    dateCreated: Date;
    sharedRecipe: Recipe;
  }
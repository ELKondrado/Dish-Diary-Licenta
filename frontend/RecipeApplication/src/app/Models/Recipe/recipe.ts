import { User } from "../User/user";

export interface Recipe{
    id: number;
    name: string;
    ingredients: string;
    stepsOfPreparation: string;
    image: String;
    userOwner: User;
}

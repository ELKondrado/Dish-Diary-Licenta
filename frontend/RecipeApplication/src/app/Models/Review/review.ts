import { User } from "../User/user";

export interface Review {
    id: number;
    userOwner: User | null;
    userStarRating: number;
    userReviewText: string;
    likes: number;
    date: Date | string;
}

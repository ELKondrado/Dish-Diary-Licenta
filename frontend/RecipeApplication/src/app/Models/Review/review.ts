import { User } from "../User/user";

export interface Review {
    id: number;
    userOwner: User | null;
    userProfileImage: string;
    userName: string;
    userStarRating: number;
    userReviewText: string;
    date: Date | string;
}

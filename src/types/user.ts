export interface UserProfile {
    uid: string;
    firstName: string;
    lastName: string;
    displayName: string;
    email: string;
    favorites?: string[];
    createdAt?: any;
    updatedAt?: any;
}

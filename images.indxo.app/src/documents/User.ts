// NOTE: This typing is not entirely correct as this service does not need access to all the user properties.
export interface User {
    _id: string;
    name: string;
    picture: string;
    created: number;
    googleID: string;
    email: string;
    sets: string[];
    folders: string[];
    favorites: string[];
    preferences: any;
    metadata: any;
}

export interface SessionUser {
    _id: string;
}

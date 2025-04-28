// This document is used to represent a user in the database.

import type { Document } from "mongodb";
import type { Folder } from "./Folder";
import type { Set } from "./Set";

type Favorite = [string, "set" | "folder"];

export type SortingTerm = {
    _id: string;
    knows: boolean;
    missed: number;
    sorted: boolean;
};

export type HomeSection = [string, string];

export interface User extends Document {
    _id: string;
    google: string;

    name: string;
    email: string;
    image: string;

    banned: boolean;
    sets: string[];
    folders: string[];
    favorites: Favorite[];
    homeSections: HomeSection[];
    openedSets: [string, number][];
    sorting: {
        [id: string]: SortingTerm[];
    };
}

export interface PublicUser {
    _id: string;

    // auth.js fields
    name: string;
    image: string;

    // App specific fields
    sets: Set[];
    folders: Folder[];
    favorites: Favorite[];
}

export interface SimpleUser {
    _id: string;
    name: string;
    image: string;
}

export interface SimpleUserWithEmail {
    _id: string;
    name: string;
    image: string;
    email: string;
}

export const fields: [string, "string" | "boolean" | "array" | "dictionary"][] = [
    ["banned", "boolean"],
    ["sets", "array"],
    ["folders", "array"],
    ["favorites", "array"],
    ["homeSections", "array"],
    ["openedSets", "array"],
    ["sorting", "dictionary"],
];

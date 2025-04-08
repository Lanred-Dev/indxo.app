// This document is used to represent a user in the database.

import type { Document } from "mongodb";
import type { Set } from "./Set";
import type { Folder } from "./Folder";

type favorite = [string, "set" | "folder"];

export type sortingTerm = [string, -1 | 1 | null];

export interface User extends Document {
    _id: string;
    google: string;

    name: string;
    email: string;
    image: string;

    banned: boolean;
    sets: string[];
    folders: string[];
    favorites: favorite[];
    homeSectionPreferences: string[];
    openedSets: [string, number][];
    sorting: {
        [id: string]: sortingTerm[];
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
    favorites: favorite[];
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
    ["homeSectionPreferences", "array"],
    ["openedSets", "array"],
    ["sorting", "dictionary"],
];

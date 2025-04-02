// This document is used to represent a user in the database.

import type { Document, ObjectId } from "mongodb";
import type { Set } from "./Set";
import type { Folder } from "./Folder";

type favorite = [ObjectId, "set" | "folder"];

export interface User extends Document {
    _id: ObjectId;
    google: string;

    name: string;
    email: string;
    image: string;

    banned: boolean;
    sets: ObjectId[];
    folders: ObjectId[];
    favorites: favorite[];
    homeSectionPreferences: string[];
    openedSets: [ObjectId, number][];
    setData: [
        ObjectId,
        {
            sorted: [ObjectId, -1 | 1];
        },
    ][];
}

export interface PublicUser {
    _id: ObjectId;

    // auth.js fields
    name: string;
    image: string;

    // App specific fields
    sets: Set[];
    folders: Folder[];
    favorites: favorite[];
}

export interface SimpleUser {
    _id: ObjectId;
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
    ["setData", "array"],
];

// This document is used to represent a user in the database.

import type { Document, ObjectId } from "mongodb";
import type { Set } from "./Set";
import type { Folder } from "./Folder";

type favorite = [ObjectId, "set" | "folder"];

export interface User extends Document {
    _id: ObjectId;

    // auth.js fields
    name: string;
    email: string;
    image: string;

    // App specific fields
    banned: boolean;
    sets: ObjectId[];
    folders: ObjectId[];
    favorites: favorite[];
    homeSectionPreferences: string[];
    openedSets: [ObjectId, number][];
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

export const fields: [string, "string" | "boolean" | "array"][] = [
    ["banned", "boolean"],
    ["sets", "array"],
    ["folders", "array"],
    ["favorites", "array"],
    ["homeSectionPreferences", "array"],
    ["openedSets", "array"],
];

// This document is used to represent a user in the database.

import type { Document, ObjectId } from "mongodb";

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
    homeSectionPreferences: string[];
    openedSets: [ObjectId, number][];
}

export const fields: [string, "string" | "boolean" | "array"][] = [
    ["banned", "boolean"],
    ["sets", "array"],
    ["folders", "array"],
    ["homeSectionPreferences", "array"],
    ["openedSets", "array"],
];

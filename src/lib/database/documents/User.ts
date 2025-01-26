// This document is used to represent a user in the database.

import type { Document } from "mongodb";
import type { Set } from "./Set";

export interface User extends Document {
    // auth.js fields
    _id: string;
    name: string;
    email: string;
    image: string;

    // App specific fields
    banned: boolean;
    sets: Array<Set>;
    homeSectionPreferences: Array<string>;
    recentSets: Array<[string, number]>;
}

export const fields: [string, "string" | "boolean" | "array"][] = [
    ["banned", "boolean"],
    ["sets", "array"],
    ["homeSectionPreferences", "array"],
    ["recentSets", "array"],
];

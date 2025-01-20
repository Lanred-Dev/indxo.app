// This document is used to represent a user in the database.

import type { Document } from "mongodb";

export interface User extends Document {
    // auth.js fields
    _id: string;
    name: string;
    email: string;
    image: string;

    // App specific fields
    banned: boolean;
    sets: Array<string>;
}

export const fields: [string, "string" | "boolean" | "array"][] = [
    ["banned", "boolean"],
    ["sets", "array"],
];

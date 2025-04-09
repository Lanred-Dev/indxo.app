// This document is used to represent a folder in the database.

import type { Document } from "mongodb";
import type { SimpleUser } from "./User";
import type { PublicSet } from "./Set";

export interface Folder extends Document {
    _id: string;
    icon: string;
    name: string;
    description: string;
    isPublic: boolean;
    sets: string[];
    owner: string;
    created: number;
}

export interface PublicFolder {
    _id: string;
    icon: string;
    name: string;
    description: string;
    isPublic: boolean;
    sets: PublicSet[];
    owner: SimpleUser;
    created: number;
}

export interface SimpleFolder {
    _id: string;
    icon: string;
    name: string;
    description: string;
}

export const updatableFields: { [key: string]: "string" | "boolean" | "array" } = {
    icon: "string",
    name: "string",
    description: "string",
    isPublic: "boolean",
    sets: "array",
};

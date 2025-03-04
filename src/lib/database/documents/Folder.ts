// This document is used to represent a folder in the database.

import type { Document, ObjectId } from "mongodb";
import type { SimpleUser } from "./User";
import type { Set } from "./Set";

export interface Folder extends Document {
    _id: ObjectId;
    icon: string;
    name: string;
    description: string;
    isPublic: boolean;
    sets: ObjectId[];
    owner: ObjectId;
    created: number;
}

export interface PublicFolder {
    _id: ObjectId;
    icon: string;
    name: string;
    description: string;
    isPublic: boolean;
    sets: Set[];
    owner: SimpleUser;
    created: number;
}

export interface SimpleFolder {
    _id: ObjectId;
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

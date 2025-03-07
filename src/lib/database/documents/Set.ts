// This document is used to represent a set in the database.

import type { Document, ObjectId } from "mongodb";
import type { SimpleUser } from "./User";

export type Term = {
    term: string;
    definition: string;
    image?: string;
};

export interface Set extends Document {
    _id: ObjectId;
    name: string;
    description: string;
    subject: string;
    isPublic: boolean;
    terms: Term[];
    owner: ObjectId;
    created: number;
    folder: ObjectId[];
}

export interface PublicSet {
    _id: ObjectId;
    name: string;
    description: string;
    subject: string;
    isPublic: boolean;
    terms: Term[];
    owner: SimpleUser;
    created: number;
    folder: ObjectId[];
}

export interface SimpleSet {
    _id: ObjectId;
    icon: string;
    name: string;
    description: string;
    subject: string;
}

export const updatableFields: { [key: string]: "string" | "boolean" | "array" } = {
    name: "string",
    description: "string",
    subject: "string",
    isPublic: "boolean",
    terms: "array",
    folder: "array",
};

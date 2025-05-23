// This document is used to represent a set in the database.

import type { Document } from "mongodb";
import type { SimpleUser } from "./User";

export const setIDPrefix: string = "s";

export type Term = {
    _id: string;
    term: string;
    definition: string;
    image?: string;
};

export interface Set extends Document {
    _id: string;
    name: string;
    description: string;
    subject: string;
    isPublic: boolean;
    terms: Term[];
    owner: string;
    created: number;
    folder: string[];
}

export interface PublicSet {
    _id: string;
    name: string;
    description: string;
    subject: string;
    isPublic: boolean;
    terms: Term[];
    owner: SimpleUser;
    created: number;
    folder: string[];
}

export interface SimpleSet {
    _id: string;
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

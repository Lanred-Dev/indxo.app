// This document is used to represent a set in the database.

import type { Document, ObjectId } from "mongodb";

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
    public: boolean;
    terms: Term[];
    owner: { name: string; email: string };
    created: number;
}

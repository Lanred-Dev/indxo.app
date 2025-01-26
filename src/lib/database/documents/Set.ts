// This document is used to represent a set in the database.

import type { Document } from "mongodb";

type Term = {
    term: string;
    definition: string;
    image?: string;
};

export interface Set extends Document {
    _id: string;
    name: string;
    description: string;
    public: boolean;
    terms: Array<Term>;
    owner: { name: string; email: string };
}

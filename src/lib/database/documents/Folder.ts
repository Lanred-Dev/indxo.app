// This document is used to represent a folder in the database.

import type { Document, ObjectId } from "mongodb";

export interface Folder extends Document {
    _id: ObjectId;
    icon: string;
    name: string;
    description: string;
    isPublic: boolean;
    sets: ObjectId[];
    owner: { name: string; email: string };
    created: number;
}

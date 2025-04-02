// This document is used to represent a session in the database.

import type { Document, ObjectId } from "mongodb";

export interface Session extends Document {
    _id: string;
    user: ObjectId;
    expires: Date;
}

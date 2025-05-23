// This document is used to represent a session in the database.

import type { Document } from "mongodb";

export const sessionIDPrefix: string = "m";

export interface Session extends Document {
    _id: string;
    user: string;
    expires: number;
}

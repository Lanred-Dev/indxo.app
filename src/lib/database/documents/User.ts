import type { Document } from "mongodb";

export default interface User extends Document {
    id: string;
    email: string;
    sets: Array<string>;
    created: Date;
}

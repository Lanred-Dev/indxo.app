import { loadCollection } from "$lib/database/mongo";
import type { Collection } from "mongodb";
import type { User } from "$lib/database/documents/User.ts";

const users: Collection<User> = loadCollection("accounts", "users");

export default async function getUser(email: string): Promise<User | null> {
    return await users.findOne({ email });
}

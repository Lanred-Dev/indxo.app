import type { Collection } from "mongodb";
import { loadCollection } from "$lib/database/mongo";
import type { User } from "$lib/database/documents/User.ts";

const users: Collection<User> = loadCollection("accounts", "users");

/**
 * Retrieves a user from the database using their email.
 *
 * NOTE: For most use cases `idToDocument` should be used instead this is only for when you need to find a user by email.
 *
 * @param email The user email.
 * @returns The user if found, otherwise null.
 */
export default async function getUser(email: string): Promise<User | null> {
    return await users.findOne({ email });
}

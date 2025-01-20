import { loadCollection } from "$lib/database/mongo";
import type { Collection } from "mongodb";
import type { User } from "$lib/database/documents/User.ts";

const users: Collection<User> = loadCollection("accounts", "users");

export async function load({ locals }) {
    // Search the collection for the user and return their sets.
    const user = await users.findOne({ email: locals.session.user.email });

    return {
        sets: user?.sets,
    };
}

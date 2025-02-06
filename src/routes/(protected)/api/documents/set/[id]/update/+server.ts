import { json } from "@sveltejs/kit";
import { loadCollection } from "$lib/database/mongo";
import { ObjectId, type Collection } from "mongodb";
import type { Set } from "$lib/database/documents/Set";
import type { User } from "$lib/database/documents/User";

const users: Collection<User> = loadCollection("accounts", "users");
const sets: Collection<Set> = loadCollection("documents", "sets");

export async function POST({ params, locals }) {
    const id: ObjectId = new ObjectId(params.id);

    return json({
        success: true,
    });
}

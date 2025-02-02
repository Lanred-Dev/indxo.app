import { json } from "@sveltejs/kit";
import idToDocument from "$lib/database/utils/idToDocument";
import type { Set } from "$lib/database/documents/Set";
import type { ObjectId } from "mongodb";
import type { User } from "$lib/database/documents/User";

export async function GET({ params }) {
    const user: User = await idToDocument("users", params.id);
    const sets: Set[] = [];

    user.sets.forEach(async (id: ObjectId) => {
        const set: Set = await idToDocument("sets", id);
        sets.push(set);
    });

    return json(sets);
}

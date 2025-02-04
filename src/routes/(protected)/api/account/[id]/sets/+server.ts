import { json } from "@sveltejs/kit";
import idToDocument from "$lib/database/utils/idToDocument";
import type { Set } from "$lib/database/documents/Set";
import type { User } from "$lib/database/documents/User";

export async function GET({ params }) {
    const user: User = await idToDocument("users", params.id);
    const sets: Set[] = [];

    for (const id of user.sets) {
        const set: Set = await idToDocument("sets", id);

        if (!set) {
            continue;
        }

        sets.push(set);
    }

    return json(sets);
}

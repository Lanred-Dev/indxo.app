import { error, json } from "@sveltejs/kit";
import idToDocument from "$lib/utils/idToDocument";
import type { PublicSet, Set } from "$lib/database/documents/Set";
import type { User } from "$lib/database/documents/User";

export async function GET({ params, fetch }) {
    const user: User | null = await idToDocument("users", params.id);

    if (!user) error(404, "User not found.");

    const sets: PublicSet[] = [];

    for (const id of user.sets) {
        const response = await fetch(`/api/documents/set/${id}`);

        if (response.status !== 200) continue;

        const set: PublicSet = await response.json();
        sets.push(set);
    }

    return json(sets);
}

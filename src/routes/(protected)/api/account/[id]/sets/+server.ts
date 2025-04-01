import { error, json } from "@sveltejs/kit";
import idToDocument from "$lib/utils/idToDocument";
import type { PublicSet, Set } from "$lib/database/documents/Set";
import type { User } from "$lib/database/documents/User";

export async function GET({ params }) {
    const user: User | null = await idToDocument("users", params.id);

    if (!user) return error(404, "User not found.");

    const sets: PublicSet[] = [];

    for (const id of user.sets) {
        const set: Set = await idToDocument("sets", id);

        if (!set) {
            continue;
        }

        (set as unknown as PublicSet).owner = {
            _id: user._id,
            name: user.name,
            image: user.image,
        };

        sets.push(set as unknown as PublicSet);
    }

    return json(sets);
}

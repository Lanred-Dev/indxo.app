import { json } from "@sveltejs/kit";
import idToDocument from "$lib/utils/idToDocument";
import type { User } from "$lib/database/documents/User";
import type { PublicSet } from "$lib/database/documents/Set.js";
import { error } from "@sveltejs/kit";

export async function GET({ locals, fetch }) {
    if (!locals.session) error(401, "Unauthorized.");

    const user: User = await idToDocument("users", locals.user._id);
    const openedSets = user.openedSets;

    // Limit to 10 sets and sort by most recent
    openedSets.sort((set1, set2) => set1[1] - set2[1]);
    openedSets.reverse();
    openedSets.splice(10);

    // Fetch all data for the sets
    let sets: PublicSet[] = [];

    openedSets.forEach(async (info) => {
        const set: PublicSet = await (await fetch(`/api/set/${info[0]}`)).json();
        sets.push(set);
    });

    return json({
        type: "card",
        linkTo: "/my/recents/",
        items: sets,
    });
}

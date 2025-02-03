import { json } from "@sveltejs/kit";
import idToDocument from "$lib/database/utils/idToDocument.js";
import type { User } from "$lib/database/documents/User";

export async function GET({ locals }) {
    const user: User = await idToDocument("users", locals.userID);
    const openedSets = user.openedSets;

    // Limit to 10 sets and sort by most recent
    openedSets.sort((set1, set2) => set1[1] - set2[1]);
    openedSets.reverse();
    openedSets.splice(10);

    return json({
        type: "set",
        cards: openedSets,
    });
}

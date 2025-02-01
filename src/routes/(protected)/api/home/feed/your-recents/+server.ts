import { json } from "@sveltejs/kit";
import getUser from "$lib/database/utils/getUser";
import type { User } from "$lib/database/documents/User";

export async function GET({ locals }) {
    const user: User | null = await getUser(locals.session.email);
    const openedSets = user?.openedSets ?? [];

    // Limit to 10 sets and sort by most recent
    openedSets.sort((set1, set2) => set1[1] - set2[1]);
    openedSets.reverse();
    openedSets.splice(10);

    return json({
        sets: openedSets,
    });
}

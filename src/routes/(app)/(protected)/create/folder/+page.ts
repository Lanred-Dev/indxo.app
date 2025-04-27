import type { PublicSet } from "$lib/database/documents/Set";

export async function load({ fetch, parent }) {
    const { user } = await parent();
    const userSets: PublicSet[] = await (await fetch(`/api/user/${user._id}/sets`)).json();
    return {
        userSets,
    };
}

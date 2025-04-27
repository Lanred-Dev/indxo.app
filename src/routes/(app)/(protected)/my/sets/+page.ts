import type { PublicSet } from "$lib/database/documents/Set.js";

export async function load({ fetch, parent }) {
    const { user } = await parent();
    const documents: PublicSet[] = await (await fetch(`/api/user/${user._id}/sets`)).json();

    return {
        documents,
    };
}

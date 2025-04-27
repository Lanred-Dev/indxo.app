import type { PublicFolder } from "$lib/database/documents/Folder";
import type { PublicSet } from "$lib/database/documents/Set.js";

export async function load({ fetch, parent }) {
    const { user } = await parent();
    const documents: (PublicFolder | PublicSet)[] = await (
        await fetch(`/api/user/${user._id}/favorites`)
    ).json();

    return {
        documents,
    };
}

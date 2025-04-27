import type { PublicFolder } from "$lib/database/documents/Folder";
import type { PublicSet } from "$lib/database/documents/Set.js";
import { redirect } from "@sveltejs/kit";

export async function load({ fetch, params, parent }) {
    // This corrects the URL if its not /folders, /sets, /favorites.
    if (params.slug !== "folders" && params.slug !== "sets" && params.slug !== "favorites")
        redirect(308, `/my/sets`);

    const { user } = await parent();
    const documents: (PublicFolder | PublicSet)[] = await (
        await fetch(`/api/user/${user._id}/${params.slug}`)
    ).json();

    return {
        documents,
    };
}

import type { Folder, PublicFolder } from "$lib/database/documents/Folder";
import type { PublicSet } from "$lib/database/documents/Set";
import type { SimpleUser } from "$lib/database/documents/User";
import idToDocument from "$lib/utils/idToDocument";
import permissionCheck from "$lib/utils/permissionCheck";
import { error, json } from "@sveltejs/kit";

export async function GET({ params, fetch, locals }) {
    const folder: Folder = await idToDocument("folders", params.id);

    if (!permissionCheck(folder, locals.user._id))
        error(403, "You do not have permission to view this folder.");

    const sets: PublicSet[] = [];

    for (const id of folder.sets) {
        const set = await fetch(`/api/documents/set/${id}`);

        if (set.status !== 200) continue;

        sets.push((await set.json()) as PublicSet);
    }

    (folder as unknown as PublicFolder).sets = sets;

    const owner: SimpleUser = await (await fetch(`/api/user/${folder.owner}/simple`)).json();
    (folder as unknown as PublicFolder).owner = owner;

    return json(folder);
}

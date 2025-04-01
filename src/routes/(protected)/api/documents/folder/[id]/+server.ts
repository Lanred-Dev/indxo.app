import { error, json } from "@sveltejs/kit";
import idToDocument from "$lib/utils/idToDocument";
import type { Folder, PublicFolder } from "$lib/database/documents/Folder";
import type { Set } from "$lib/database/documents/Set";
import permissionCheck from "$lib/utils/permissionCheck";
import type { SimpleUser } from "$lib/database/documents/User";

export async function GET({ params, fetch, locals }) {
    const folder: Folder = await idToDocument("folders", params.id);

    if (!permissionCheck(folder, locals.user._id))
        return error(403, "You do not have permission to view this folder.");

    const sets: Set[] = [];

    for (const id of folder.sets) {
        const set: Set = await (await fetch(`/api/documents/set/${id}`)).json();
        sets.push(set);
    }

    (folder as unknown as PublicFolder).sets = sets;

    const owner: SimpleUser = await (await fetch(`/api/account/${folder.owner}/simple`)).json();
    (folder as unknown as PublicFolder).owner = owner;

    return json(folder);
}

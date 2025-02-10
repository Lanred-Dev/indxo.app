import { json } from "@sveltejs/kit";
import idToDocument from "$lib/utils/idToDocument";
import type { Folder, PublicFolder } from "$lib/database/documents/Folder";
import type { Set } from "$lib/database/documents/Set";
import permissionCheck from "$lib/utils/permissionCheck";
import type { PublicUser } from "$lib/database/documents/User";

export async function GET({ params, fetch, locals }) {
    const folder: Folder = await idToDocument("folders", params.id);

    if (!permissionCheck(folder, locals.userID)) {
        return json({ success: false });
    }

    const sets: Set[] = [];

    for (const id of folder.sets) {
        const set: Set = await (await fetch(`/api/documents/set/${id}`)).json();
        sets.push(set);
    }

    (folder as unknown as PublicFolder).sets = sets;

    const owner: PublicUser = await (await fetch(`/api/account/${folder.owner}`)).json();
    (folder as unknown as PublicFolder).owner = owner;

    return json(folder);
}

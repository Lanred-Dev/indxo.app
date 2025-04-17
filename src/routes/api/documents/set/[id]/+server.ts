import type { PublicSet, Set } from "$lib/database/documents/Set";
import type { SimpleUser } from "$lib/database/documents/User";
import idToDocument from "$lib/utils/idToDocument";
import permissionCheck from "$lib/utils/permissionCheck";
import { error, json } from "@sveltejs/kit";

export async function GET({ params, locals, fetch }) {
    const set: Set = await idToDocument("sets", params.id);

    if (!permissionCheck(set, locals.user._id))
        error(403, "You do not have permission to view this set.");

    const owner: SimpleUser = await (await fetch(`/api/user/${set.owner}/simple`)).json();
    (set as unknown as PublicSet).owner = owner;

    return json(set);
}

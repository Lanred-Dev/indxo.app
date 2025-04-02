import { error, json } from "@sveltejs/kit";
import idToDocument from "$lib/utils/idToDocument";
import type { PublicSet, Set } from "$lib/database/documents/Set";
import type { SimpleUser } from "$lib/database/documents/User";
import permissionCheck from "$lib/utils/permissionCheck";

export async function GET({ params, locals, fetch }) {
    const set: Set = await idToDocument("sets", params.id);

    if (!permissionCheck(set, locals.user._id))
        error(403, "You do not have permission to view this set.");

    const owner: SimpleUser = await (await fetch(`/api/account/${set.owner}/simple`)).json();
    (set as unknown as PublicSet).owner = owner;

    return json(set);
}

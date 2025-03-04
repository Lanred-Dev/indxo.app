import { json } from "@sveltejs/kit";
import idToDocument from "$lib/utils/idToDocument";
import type { PublicSet, Set } from "$lib/database/documents/Set";
import type { SimpleUser } from "$lib/database/documents/User";
import permissionCheck from "$lib/utils/permissionCheck";

export async function GET({ params, locals, fetch }) {
    const set: Set = await idToDocument("sets", params.id);

    if (!permissionCheck(set, locals.userID)) {
        return json({ success: false }, { status: 403 });
    }

    const owner: SimpleUser = await (await fetch(`/api/account/${set.owner}/simple`)).json();
    (set as unknown as PublicSet).owner = owner;

    return json(set);
}

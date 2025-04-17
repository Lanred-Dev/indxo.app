import type { Set } from "$lib/database/documents/Set";
import type { User } from "$lib/database/documents/User";
import idToDocument from "$lib/utils/idToDocument";
import permissionCheck from "$lib/utils/permissionCheck";
import { error, json } from "@sveltejs/kit";

export async function GET({ params, locals, fetch }) {
    if (!locals.session) error(401, "Unauthorized.");

    const set: Set = await (await fetch(`/api/documents/set/${params.id}`)).json();

    if (!permissionCheck(set, locals.user._id))
        error(403, "You do not have permission to view this set.");

    const user: User = await idToDocument("users", locals.user._id);
    return json(user.sorting[params.id] || []);
}

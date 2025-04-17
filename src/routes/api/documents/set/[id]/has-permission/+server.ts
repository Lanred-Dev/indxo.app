import { type Set } from "$lib/database/documents/Set";
import permissionCheck from "$lib/utils/permissionCheck";
import { error, json } from "@sveltejs/kit";

export async function GET({ params, locals, fetch }) {
    if (!locals.session) error(401, "Unauthorized.");

    const set: Set = await (await fetch(`/api/documents/set/${params.id}`)).json();
    return json(permissionCheck(set, locals.user._id, true));
}

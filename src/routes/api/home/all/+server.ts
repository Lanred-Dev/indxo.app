import type { PublicSet } from "$lib/database/documents/Set";
import { error, json } from "@sveltejs/kit";

export async function GET({ fetch, locals }) {
    if (!locals.session) error(401, "Unauthorized.");

    const sets: PublicSet[] = await (await fetch(`/api/user/${locals.user._id}/sets`)).json();

    return json({
        type: "card",
        linkTo: "/my/sets/",
        items: sets,
    });
}

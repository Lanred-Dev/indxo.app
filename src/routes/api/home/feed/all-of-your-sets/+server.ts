import { error, json } from "@sveltejs/kit";
import type { PublicSet } from "$lib/database/documents/Set";

export async function GET({ fetch, locals }) {
    if (!locals.session) error(401, "Unauthorized.");

    const sets: PublicSet[] = await (await fetch(`/api/account/${locals.user._id}/sets`)).json();

    return json({
        type: "card",
        linkTo: "/my/sets/",
        items: sets,
    });
}

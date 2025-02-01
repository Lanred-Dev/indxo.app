import { json } from "@sveltejs/kit";
import type { Set } from "$lib/database/documents/Set";

export async function GET({ fetch, locals }) {
    const sets: Set[] = await (
        await fetch(`/account/${locals.session.user.email}/sets/all`)
    ).json();

    return json({
        sets,
    });
}

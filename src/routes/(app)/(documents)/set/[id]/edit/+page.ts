import type { PublicSet } from "$lib/database/documents/Set";
import { redirect } from "@sveltejs/kit";

export async function load({ fetch, params }) {
    const response = await fetch(`/api/documents/set/${params.id}`);

    if (response.status === 403) redirect(403, `/set/${params.id}`);

    const set: PublicSet = await response.json();

    return set;
}

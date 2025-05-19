import type { PublicSet } from "$lib/database/documents/Set";
import { redirect } from "@sveltejs/kit";

export async function load({ params, fetch }) {
    const response: Response = await fetch(`/api/documents/set/${params.id}`);

    if (response.status === 403) redirect(307, `/set/${params.id}`);

    const set: PublicSet = await response.json();

    if (set.terms.length === 0) redirect(303, `/set/${params.id}`);

    return set;
}

import type { PublicSet } from "$lib/database/documents/Set";
import type { SortingTerm } from "$lib/database/documents/User";
import { redirect } from "@sveltejs/kit";

export async function load({ fetch, params }) {
    const response = await fetch(`/api/documents/set/${params.id}`);

    if (response.status === 403) redirect(403, `/set/${params.id}`);

    const set: PublicSet = await response.json();

    if (set.terms.length === 0) redirect(302, `/set/${params.id}`);

    let saved: SortingTerm[] = await (
        await fetch(`/api/documents/set/${params.id}/sorting`)
    ).json();

    if (saved.length === 0)
        saved = set.terms.map(({ _id }) => ({
            _id,
            knows: false,
            missed: 0,
            sorted: false,
        }));

    return {
        set,
        saved,
    };
}

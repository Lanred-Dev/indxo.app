import type { PublicSet } from "$lib/database/documents/Set";
import type { SortingTerm } from "$lib/database/documents/User";

export async function load({ fetch, params, parent }) {
    const set: PublicSet = await parent();

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

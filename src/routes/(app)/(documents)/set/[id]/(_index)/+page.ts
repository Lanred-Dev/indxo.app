import type { PublicSet } from "$lib/database/documents/Set";
import type { SortingTerm } from "$lib/database/documents/User";

export async function load({ fetch, params }) {
    const response: Response = await fetch(`/api/documents/set/${params.id}`);

    if (response.status === 403)
        return {
            canView: false,
        };

    const set: PublicSet = await response.json();
    const isFavorite: boolean = await (
        await fetch(`/api/documents/${params.id}/is-favorite`)
    ).json();
    const hasPermission: boolean = await (
        await fetch(`/api/documents/set/${params.id}/has-permission`)
    ).json();
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
        canView: true,
        set,
        saved,
        isFavorite,
        hasPermission,
    };
}

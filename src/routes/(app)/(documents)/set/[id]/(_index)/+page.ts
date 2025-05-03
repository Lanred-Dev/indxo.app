import type { PublicSet } from "$lib/database/documents/Set";

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

    return {
        canView: true,
        set,
        isFavorite,
        hasPermission,
    };
}

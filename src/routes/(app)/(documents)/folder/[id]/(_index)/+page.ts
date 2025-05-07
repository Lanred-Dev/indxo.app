import type { PublicFolder } from "$lib/database/documents/Folder";

export async function load({ fetch, params }) {
    const response: Response = await fetch(`/api/documents/folder/${params.id}`);

    if (response.status === 403)
        return {
            canView: false,
        };

    const folder: PublicFolder = await response.json();
    const isFavorite: boolean = await (
        await fetch(`/api/documents/${params.id}/is-favorite`)
    ).json();
    const hasPermission: boolean = await (
        await fetch(`/api/documents/folder/${params.id}/has-permission`)
    ).json();

    return {
        canView: true,
        folder,
        isFavorite,
        hasPermission,
    };
}

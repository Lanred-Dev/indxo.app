import type { PublicFolder } from "$lib/database/documents/Folder";

export async function load({ fetch, params }) {
    const response = await fetch(`/api/documents/folder/${params.id}`);

    if (response.status === 403) {
        return {
            permission: false,
        };
    }

    const folder: PublicFolder = await response.json();
    return folder;
}

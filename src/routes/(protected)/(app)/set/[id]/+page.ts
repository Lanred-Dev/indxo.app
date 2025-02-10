import type { PublicSet } from "$lib/database/documents/Set";

export async function load({ fetch, params }) {
    const response = await fetch(`/api/documents/set/${params.id}`);

    if (response.status === 403) {
        return {
            permission: false,
        };
    }

    await fetch(`/api/documents/set/${params.id}/open`);

    const set: PublicSet = await response.json();
    return set;
}

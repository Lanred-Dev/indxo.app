import type { PublicSet } from "$lib/database/documents/Set";

export async function load({ parent }) {
    const set: PublicSet = await parent();

    return {
        set,
    };
}

import type { PublicSet } from "$lib/database/documents/Set";

export async function load({ fetch, params }) {
    const userID: number = await (await fetch("/api/account")).json();
    const sets: PublicSet[] = await (await fetch(`/api/account/${userID}/sets`)).json();

    return {
        sets,
    };
}

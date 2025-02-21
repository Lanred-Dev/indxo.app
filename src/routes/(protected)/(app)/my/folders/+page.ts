import type { PublicFolder } from "$lib/database/documents/Folder";

export async function load({ fetch, params }) {
    const userID: string = await (await fetch("/api/account")).json();
    const folders: PublicFolder[] = await (await fetch(`/api/account/${userID}/folders`)).json();

    return {
        folders,
    };
}

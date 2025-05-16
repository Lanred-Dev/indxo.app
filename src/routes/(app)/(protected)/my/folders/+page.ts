import type { PublicFolder } from "$lib/database/documents/Folder";

export async function load({ fetch, parent }) {
    const { user } = await parent();
    const documents: PublicFolder[] = await (await fetch(`/api/user/${user._id}/folders`)).json();

    return {
        documents,
    };
}

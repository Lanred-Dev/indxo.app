import type { PublicFolder } from "$lib/database/documents/Folder.js";
import { redirect } from "@sveltejs/kit";

export async function load({ fetch, params }) {
    const response: Response = await fetch(`/api/documents/folder/${params.id}`);

    if (response.status === 403) redirect(307, `/folder/${params.id}`);

    const folder: PublicFolder = await response.json();
    return folder;
}

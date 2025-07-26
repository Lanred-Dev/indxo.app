import type { PublicFolder, User } from "$lib/documents";
import { findDocumentByID } from "$lib/server/utils/document/findByID.js";
import { ResponseCodes, ResponseMessages } from "$lib/utils/apiResponses.js";
import { error, json } from "@sveltejs/kit";

export async function GET({ params, fetch }) {
    const user: User | null = await findDocumentByID(params.id);

    if (!user) error(ResponseCodes.NotFound, ResponseMessages.NotFound);

    const folders: PublicFolder[] = [];

    for (const id of user.folders) {
        const response: Response = await fetch(`/api/documents/folder/${id}`);

        if (response.status !== ResponseCodes.Success) continue;

        const folder: PublicFolder = await response.json();
        folders.push(folder);
    }

    return json(folders);
}

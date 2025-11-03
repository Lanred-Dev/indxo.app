import type { PublicFolder, User } from "$lib/documents";
import { findDocumentByID } from "$lib/server/utils/document/findByID";
import { ResponseCodes, ResponseMessages } from "$lib/utils/apiResponses";
import { error, json } from "@sveltejs/kit";

export async function GET({ params, fetch }) {
    const user: User | null = await findDocumentByID(params.id);

    if (!user) error(ResponseCodes.NotFound, ResponseMessages.NotFound);

    const folders: PublicFolder[] = [];

    for (const id of user.folders) {
        const response: Response = await fetch(`/api/documents/${id}`);

        if (response.status !== ResponseCodes.Success) continue;

        folders.push(await response.json());
    }

    return json(folders);
}

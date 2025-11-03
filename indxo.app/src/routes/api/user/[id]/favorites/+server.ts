import type { PublicFolder, PublicSet, User } from "$lib/documents";
import { findDocumentByID } from "$lib/server/utils/document/findByID";
import { ResponseCodes, ResponseMessages } from "$lib/utils/apiResponses";
import { error, json } from "@sveltejs/kit";

export async function GET({ params, fetch }) {
    const user: User | null = await findDocumentByID(params.id);

    if (!user) error(ResponseCodes.NotFound, ResponseMessages.NotFound);

    const documents: (PublicSet | PublicFolder)[] = [];

    for (const id of user.favorites) {
        const response: Response = await fetch(`/api/documents/${id}`);

        if (response.status !== ResponseCodes.Success) continue;

        documents.push(await response.json());
    }

    return json(documents);
}

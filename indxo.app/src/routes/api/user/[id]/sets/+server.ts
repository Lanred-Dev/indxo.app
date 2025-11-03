import type { PublicSet } from "$lib/documents/Set";
import type { User } from "$lib/documents/User";
import { findDocumentByID } from "$lib/server/utils/document/findByID";
import { ResponseCodes, ResponseMessages } from "$lib/utils/apiResponses";
import { error, json } from "@sveltejs/kit";

export async function GET({ params, fetch }) {
    const user: User | null = await findDocumentByID(params.id);

    if (!user) error(ResponseCodes.NotFound, ResponseMessages.NotFound);

    const sets: PublicSet[] = [];

    for (const id of user.sets) {
        const response: Response = await fetch(`/api/documents/${id}`);

        if (response.status !== ResponseCodes.Success) continue;

        sets.push(await response.json());
    }

    return json(sets);
}

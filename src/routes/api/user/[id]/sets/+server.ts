import type { PublicSet } from "$lib/documents/Set.js";
import type { User } from "$lib/documents/User.js";
import { findDocumentByID } from "$lib/server/utils/document/findByID.js";
import { ResponseCodes, ResponseMessages } from "$lib/utils/apiResponses.js";
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

import type { BaseUser, User } from "$lib/documents";
import { findDocumentByID } from "$lib/server/utils/document/findByID";
import { ResponseCodes, ResponseMessages } from "$lib/utils/apiResponses";
import { error, json } from "@sveltejs/kit";

export async function GET({ params }) {
    const user: User | null = await findDocumentByID(params.id);

    if (!user) error(ResponseCodes.NotFound, ResponseMessages.NotFound);

    return json({
        _id: user._id,
        name: user.name,
        picture: user.picture,
        created: user.created,
    } satisfies BaseUser);
}

import type { PublicFolder, PublicSet, PublicUser, User } from "$lib/documents";
import { findDocumentByID } from "$lib/server/utils/document/findByID";
import { ResponseCodes, ResponseMessages } from "$lib/utils/apiResponses";
import { error, json } from "@sveltejs/kit";

export async function GET({ params, fetch }) {
    const user: User | null = await findDocumentByID(params.id);

    if (!user) error(ResponseCodes.NotFound, ResponseMessages.NotFound);

    const sets: PublicSet[] = await (await fetch(`/api/user/${params.id}/sets`)).json();
    const folders: PublicFolder[] = await (await fetch(`/api/user/${params.id}/folders`)).json();
    return json({
        _id: user._id,
        name: user.name,
        picture: user.picture,
        sets: sets,
        folders: folders,
        favorites: user.favorites,
        created: user.created,
    } satisfies PublicUser);
}

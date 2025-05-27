import type { BaseUser, User } from "$lib/documents";
import { findDocumentByID } from "$lib/utils/document";
import { error, json } from "@sveltejs/kit";

export async function GET({ params }) {
    const user: User | null = await findDocumentByID(params.id);

    if (!user) error(404, "User not found.");

    return json({
        _id: user._id,
        name: user.name,
        picture: user.picture,
        created: user.created,
    } satisfies BaseUser);
}

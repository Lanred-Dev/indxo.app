// This mimics /[id]/+server.ts but only returns the user id, name and image.

import { json } from "@sveltejs/kit";
import idToDocument from "$lib/utils/idToDocument";
import type { User } from "$lib/database/documents/User";

export async function GET({ params }) {
    const user: User | null = await idToDocument("users", params.id);

    if (!user) {
        return json({
            success: false,
        });
    }

    return json({
        _id: user._id,
        name: user.name,
        image: user.image,
    });
}

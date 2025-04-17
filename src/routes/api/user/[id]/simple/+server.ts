import type { User } from "$lib/database/documents/User";
import idToDocument from "$lib/utils/idToDocument";
import { error, json } from "@sveltejs/kit";

export async function GET({ params }) {
    const user: User | null = await idToDocument("users", params.id);

    if (!user) error(404, "User not found.");

    return json({
        _id: user._id,
        name: user.name,
        image: user.image,
    });
}

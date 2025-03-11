import { json } from "@sveltejs/kit";
import idToDocument from "$lib/utils/idToDocument";
import type { User } from "$lib/database/documents/User";

export async function GET({ params, locals }) {
    const user: User | null = await idToDocument("users", locals.userID);

    if (!user) {
        return json({
            success: false,
        });
    }

    return json(user.favorites.map((favorite) => favorite[0].toString()).includes(params.id));
}

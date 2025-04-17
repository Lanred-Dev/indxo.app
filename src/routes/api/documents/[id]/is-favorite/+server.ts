import type { User } from "$lib/database/documents/User";
import idToDocument from "$lib/utils/idToDocument";
import { error, json } from "@sveltejs/kit";

export async function GET({ params, locals }) {
    const user: User | null = await idToDocument("users", locals.user._id);

    if (!user) error(404, "User not found.");

    return json(user.favorites.map((favorite) => favorite[0]).includes(params.id));
}

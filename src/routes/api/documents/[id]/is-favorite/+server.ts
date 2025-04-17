import { error, json } from "@sveltejs/kit";
import idToDocument from "$lib/utils/idToDocument";
import type { User } from "$lib/database/documents/User";

export async function GET({ params, locals }) {
    const user: User | null = await idToDocument("users", locals.user._id);

    if (!user) error(404, "User not found.");

    return json(user.favorites.map((favorite) => favorite[0]).includes(params.id));
}

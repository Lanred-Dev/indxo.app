import type { User } from "$lib/database/documents/User";
import idToDocument from "$lib/utils/idToDocument";
import { error, json } from "@sveltejs/kit";

export async function GET({ locals }) {
    if (!locals.session) error(401, "Unauthorized.");

    const user: User = await idToDocument("users", locals.user._id);
    return json(user.homeSectionPreferences);
}

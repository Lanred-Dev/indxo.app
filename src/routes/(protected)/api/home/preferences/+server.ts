import { json } from "@sveltejs/kit";
import idToDocument from "$lib/database/utils/idToDocument";
import type { User } from "$lib/database/documents/User";

export async function GET({ locals }) {
    const user: User = await idToDocument("users", locals.userID);
    const preferences = user.homeSectionPreferences;

    return json(preferences);
}

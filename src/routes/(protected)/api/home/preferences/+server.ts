import { json } from "@sveltejs/kit";
import idToDocument from "$lib/utils/idToDocument";
import type { User } from "$lib/database/documents/User";

export async function GET({ locals }) {
    const user: User = await idToDocument("users", locals.userID);
    return json(user.homeSectionPreferences);
}

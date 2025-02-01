import { json } from "@sveltejs/kit";
import getUser from "$lib/database/utils/getUser";

const DEFAULT_SECTION_PREFERENCES: string[] = [
    "Your recents",
    "Practice again",
    "What your struggling with",
    "All of your sets",
];

export async function GET({ locals }) {
    const user = await getUser(locals.session.user.email);
    const preferences = user?.homeSectionPreferences ?? DEFAULT_SECTION_PREFERENCES;

    return json({
        preferences: preferences,
    });
}

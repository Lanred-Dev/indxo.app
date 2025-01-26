import { json } from "@sveltejs/kit";
import getUser from "../../getUser";

const DEFAULT_SECTION_PREFERENCES: Array<string> = [
    "Your recents",
    "Practice again",
    "What your struggling with",
    "All of your sets",
];

export async function GET({ locals }) {
    const user = await getUser(locals.session.email);
    const sectionPreferences = user?.homeSectionPreferences ?? DEFAULT_SECTION_PREFERENCES;

    return json({
        preferences: sectionPreferences,
    });
}

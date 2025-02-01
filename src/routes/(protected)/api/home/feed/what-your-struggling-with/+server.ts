import { json } from "@sveltejs/kit";
import getUser from "$lib/database/utils/getUser";
import type { User } from "$lib/database/documents/User";

export async function GET({ locals }) {
    const user: User | null = await getUser(locals.session.email);
    const sets = user?.sets ?? [];

    return json({
        sets,
    });
}

import { json } from "@sveltejs/kit";
import getUser from "$lib/database/utils/getUser";

export async function GET({ locals }) {
    const user = await getUser(locals.session.email);
    const sets = user?.sets ?? [];

    return json({
        sets,
    });
}

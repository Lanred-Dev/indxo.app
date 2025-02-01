import { json } from "@sveltejs/kit";

export async function GET({ fetch, locals }) {
    const sets = await (await fetch(`/account/${locals.session.user.email}/sets/all`)).json();

    return json({
        sets,
    });
}

import { error } from "@sveltejs/kit";

export async function load({ locals }) {
    if (locals.session) return;

    error(401, "Unauthorized");
}

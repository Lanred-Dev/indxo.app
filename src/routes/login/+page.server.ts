import { redirect } from "@sveltejs/kit";

export function load({ locals }) {
    if (!locals.session) return;

    redirect(307, "/");
}

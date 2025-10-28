import { redirect } from "@sveltejs/kit";

export function load({ locals }) {
    if (!locals.session) redirect(307, "/login");
}

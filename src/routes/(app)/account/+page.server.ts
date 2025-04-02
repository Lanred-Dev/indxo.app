import { redirect } from "@sveltejs/kit";

export function load({ locals }) {
    if (!locals.session) redirect(307, "/login");

    redirect(308, `/account/${locals.user._id}`);
}

import { redirect } from "@sveltejs/kit";

export function load({ locals }) {
    console.log(locals);
    if (locals.session) return;

    redirect(307, "/login");
}

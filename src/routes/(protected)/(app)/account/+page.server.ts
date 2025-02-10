// This page redirects to `/account/{userID}`.

import { redirect } from "@sveltejs/kit";

export function load({ locals }) {
    throw redirect(308, `/account/${locals.userID}`);
}

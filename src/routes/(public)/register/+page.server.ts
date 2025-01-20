// This page redirects to `/login`.

import { redirect } from "@sveltejs/kit";

export function load() {
    throw redirect(308, "/login");
}

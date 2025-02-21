// This page redirects to `/my/sets`.

import { redirect } from "@sveltejs/kit";

export function load() {
    throw redirect(308, "/my/sets");
}

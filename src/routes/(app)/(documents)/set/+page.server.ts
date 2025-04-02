// This page redirects to `/my/sets`.

import { redirect } from "@sveltejs/kit";

export function load() {
    redirect(308, "/my/sets");
}

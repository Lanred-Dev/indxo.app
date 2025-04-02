// This page redirects to `/my/folders`.

import { redirect } from "@sveltejs/kit";

export function load() {
    redirect(308, "/my/folders");
}

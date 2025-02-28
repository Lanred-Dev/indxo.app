// This corrects the creation URL if its not /folder or /set.

import { redirect } from "@sveltejs/kit";

export function load({ params }) {
    if (params.slug === "folder" || params.slug === "set") return;

    throw redirect(308, `/create/set`);
}

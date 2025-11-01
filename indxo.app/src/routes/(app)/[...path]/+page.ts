import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = ({ url }) => {
    if (url.pathname.startsWith("/api/")) return;

    error(404, "Not Found");
};

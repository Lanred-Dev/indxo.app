import type { PublicFolder } from "$lib/database/documents/Folder.js";
import type { PublicSet } from "$lib/database/documents/Set.js";
import type { PublicUser } from "$lib/database/documents/User.js";
import type { returnOnly } from "../../api/search/+server.js";

export async function load({ fetch, url }) {
    const searchParams = new URLSearchParams(url.search);
    const query: string | null = searchParams.get("query");

    if (typeof query !== "string") {
        return {
            results: [],
        };
    }

    const returnOnly: returnOnly | null = searchParams.get("returnOnly") as returnOnly;
    const results: PublicUser | PublicSet | PublicFolder = await (
        await fetch("/api/search", {
            method: "POST",
            body: JSON.stringify({
                query,
                returnOnly,
                maxResults: 50,
            }),
        })
    ).json();

    return {
        query,
        returnOnly,
        results,
    };
}

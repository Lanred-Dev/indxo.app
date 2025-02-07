import { json } from "@sveltejs/kit";
import idToDocument from "$lib/database/utils/idToDocument";
import type { Set } from "$lib/database/documents/Set";

export async function GET({ params }) {
    const set: Set = await idToDocument("sets", params.id);

    if (!set.isPublic) {
        return json({
            error: "Could not find set.",
        });
    }

    return json({
        ...set,
    });
}

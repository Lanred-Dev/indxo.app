import { json } from "@sveltejs/kit";
import idToDocument from "$lib/utils/idToDocument";
import type { Set } from "$lib/database/documents/Set";

export async function GET({ params, locals }) {
    const set: Set | null = await idToDocument("sets", params.id);

    if (!set) {
        return json(
            {
                error: "Could not find set.",
            },
            { status: 404 }
        );
    }

    if (!set.isPublic && set.owner !== locals.userID) {
        return json(
            {
                error: "You do not have permission to view this set.",
            },
            { status: 403 }
        );
    }

    return json({
        ...set,
    });
}

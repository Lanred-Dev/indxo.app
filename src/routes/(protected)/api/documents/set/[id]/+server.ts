import { json } from "@sveltejs/kit";
import idToDocument from "$lib/database/utils/idToDocument";
import type { Set } from "$lib/database/documents/Set";

export async function GET({ params }) {
    const set: Set = await idToDocument("sets", params.id);

    return json({
        ...set,
    });
}

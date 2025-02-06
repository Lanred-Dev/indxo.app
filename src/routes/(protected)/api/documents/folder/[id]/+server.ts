import { json } from "@sveltejs/kit";
import idToDocument from "$lib/database/utils/idToDocument";
import type { Folder } from "$lib/database/documents/Folder";

export async function GET({ params }) {
    const folder: Folder = await idToDocument("folders", params.id);

    return json({
        ...folder,
    });
}

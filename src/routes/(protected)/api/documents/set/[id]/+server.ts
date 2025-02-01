import { json } from "@sveltejs/kit";
import idToDocument from "$lib/database/utils/idToDocument";

export async function GET({ params }) {
    const set = await idToDocument("sets", params.id);

    return json({
        ...set,
    });
}

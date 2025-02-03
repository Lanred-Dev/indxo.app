import { json } from "@sveltejs/kit";
import idToDocument from "$lib/database/utils/idToDocument";

export async function GET({ params }) {
    const user = await idToDocument("users", params.id);

    return json({
        name: user?.name,
        image: user?.image,
        sets: user?.sets,
    });
}

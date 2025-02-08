import { json } from "@sveltejs/kit";
import idToDocument from "$lib/utils/idToDocument";
import type { User } from "$lib/database/documents/User";

export async function GET({ params }) {
    const user: User = await idToDocument("users", params.id);

    return json({
        name: user?.name,
        image: user?.image,
        sets: user?.sets,
        folders: user?.folders,
    });
}

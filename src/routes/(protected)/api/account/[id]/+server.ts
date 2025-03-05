import { json } from "@sveltejs/kit";
import idToDocument from "$lib/utils/idToDocument";
import type { User } from "$lib/database/documents/User";
import type { Set } from "$lib/database/documents/Set";
import type { Folder } from "$lib/database/documents/Folder";

export async function GET({ params, fetch }) {
    const user: User | null = await idToDocument("users", params.id);

    if (!user) {
        return json({
            success: false,
        });
    }

    const sets: Set[] = await (await fetch(`/api/account/${params.id}/sets`)).json();
    const folders: Folder[] = await (await fetch(`/api/account/${params.id}/folders`)).json();

    return json({
        _id: user._id,
        name: user.name,
        image: user.image,
        sets: sets,
        folders: folders,
        favorites: user.favorites,
    });
}

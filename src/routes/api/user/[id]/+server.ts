import { error, json } from "@sveltejs/kit";
import idToDocument from "$lib/utils/idToDocument";
import type { User } from "$lib/database/documents/User";
import type { PublicSet } from "$lib/database/documents/Set";
import type { PublicFolder } from "$lib/database/documents/Folder";

export async function GET({ params, fetch }) {
    const user: User | null = await idToDocument("users", params.id);

    if (!user) error(404, "User not found.");

    const sets: PublicSet[] = await (await fetch(`/api/user/${params.id}/sets`)).json();
    const folders: PublicFolder[] = await (await fetch(`/api/user/${params.id}/folders`)).json();

    return json({
        _id: user._id,
        name: user.name,
        image: user.image,
        sets: sets,
        folders: folders,
        favorites: user.favorites,
    });
}

import { json } from "@sveltejs/kit";
import idToDocument from "$lib/utils/idToDocument";
import type { User } from "$lib/database/documents/User";
import type { Set } from "$lib/database/documents/Set";
import type { Folder } from "$lib/database/documents/Folder";

export async function GET({ params, fetch }) {
    const user: User = await idToDocument("users", params.id);
    const sets: Set[] = await (await fetch(`/api/account/${params.id}/sets`)).json();
    const folders: Folder[] = await (await fetch(`/api/account/${params.id}/folders`)).json();

    return json({
        name: user?.name,
        image: user?.image,
        sets: sets,
        folders: folders,
    });
}

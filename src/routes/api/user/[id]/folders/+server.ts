import type { PublicFolder } from "$lib/database/documents/Folder";
import type { User } from "$lib/database/documents/User";
import idToDocument from "$lib/utils/idToDocument";
import { error, json } from "@sveltejs/kit";

export async function GET({ params, fetch }) {
    const user: User | null = await idToDocument("users", params.id);

    if (!user) error(404, "User not found.");

    const folders: PublicFolder[] = [];

    for (const id of user.folders) {
        const response = await fetch(`/api/documents/folder/${id}`);

        if (response.status !== 200) continue;

        const folder: PublicFolder = await response.json();
        folders.push(folder);
    }

    return json(folders);
}

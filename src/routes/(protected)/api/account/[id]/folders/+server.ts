import { json } from "@sveltejs/kit";
import idToDocument from "$lib/utils/idToDocument";
import type { User } from "$lib/database/documents/User";
import type { Set } from "$lib/database/documents/Set";
import type { Folder, PublicFolder } from "$lib/database/documents/Folder";

export async function GET({ params }) {
    const user: User | null = await idToDocument("users", params.id);

    if (!user) {
        return json({ success: false }, { status: 403 });
    }

    const folders: PublicFolder[] = [];

    for (const id of user.folders) {
        const folder: Folder = await idToDocument("folders", id);

        if (!folder) {
            continue;
        }

        const sets: Set[] = [];

        for (const id of folder.sets) {
            const set: Set = await idToDocument("sets", id);
            sets.push(set);
        }

        (folder as unknown as PublicFolder).sets = sets;
        folders.push(folder as unknown as PublicFolder);
    }

    return json(folders);
}

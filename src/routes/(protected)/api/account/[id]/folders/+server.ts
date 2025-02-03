import { json } from "@sveltejs/kit";
import idToDocument from "$lib/database/utils/idToDocument";
import type { Folder } from "$lib/database/documents/Folder";
import type { ObjectId } from "mongodb";
import type { User } from "$lib/database/documents/User";
import type { Set } from "$lib/database/documents/Set";

type FolderWithSetData = Folder & {
    sets: Set[];
};

export async function GET({ params }) {
    const user: User = await idToDocument("users", params.id);
    const folders: FolderWithSetData[] = [];

    for (const id of user.folders) {
        const folder: Folder = await idToDocument("folders", id);

        folder.set.forEach(async (id: ObjectId, index: number) => {
            const set: Set = await idToDocument("sets", id);
            (folder as FolderWithSetData).sets[index] = set;
        });

        folder.push(folder as FolderWithSetData);
    }

    return json(folders);
}

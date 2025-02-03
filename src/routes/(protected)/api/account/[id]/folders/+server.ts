import { json } from "@sveltejs/kit";
import idToDocument from "$lib/database/utils/idToDocument";
import type { Folder } from "$lib/database/documents/Folder";
import type { ObjectId } from "mongodb";
import type { User } from "$lib/database/documents/User";
import type { Set } from "$lib/database/documents/Set";

type FolderWithSetData = Folder & {
    setsWithData: Set[];
};

export async function GET({ params }) {
    const user: User = await idToDocument("users", params.id);
    const folders: FolderWithSetData[] = [];

    for (const id of user.folders) {
        const folder: Folder = await idToDocument("folders", id);
        const sets: Set[] = [];

        for (const id of folder.sets) {
            const set: Set = await idToDocument("sets", id);
            sets.push(set);
        }

        (folder as FolderWithSetData).setsWithData = sets;
        folders.push(folder as FolderWithSetData);
    }

    return json(folders);
}

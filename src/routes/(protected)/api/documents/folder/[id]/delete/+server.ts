import { json } from "@sveltejs/kit";
import { loadCollection } from "$lib/database/mongo";
import { ObjectId, type Collection } from "mongodb";
import type { Folder } from "$lib/database/documents/Folder";
import type { User } from "$lib/database/documents/User";
import type { Set } from "$lib/database/documents/Set";
import permissionCheck from "$lib/utils/permissionCheck";

const users: Collection<User> = loadCollection("accounts", "users");
const folders: Collection<Folder> = loadCollection("documents", "folders");
const sets: Collection<Set> = loadCollection("documents", "sets");

export async function DELETE({ params, locals, fetch }) {
    const folder: Folder = await (await fetch(`/api/documents/folder/${params.id}`)).json();

    if (!permissionCheck(folder, locals.userID, true)) {
        return json({ success: false }, { status: 403 });
    }

    const id: ObjectId = new ObjectId(params.id);

    await folders.deleteOne({
        _id: id,
    });

    await users.updateOne(
        { _id: locals.userID },
        {
            // For some reason a type error is thrown here, but it works fine
            // @ts-ignore
            $pull: {
                folders: id,
            },
        }
    );

    // Also update all sets that are linked to the folder
    await sets.updateMany(
        { folder: id },
        {
            // For some reason a type error is thrown here, but it works fine
            // @ts-ignore
            $pull: {
                folder: id,
            },
        }
    );

    return json({
        success: true,
    });
}

import type { Folder } from "$lib/database/documents/Folder";
import type { Set } from "$lib/database/documents/Set";
import type { User } from "$lib/database/documents/User";
import { loadCollection } from "$lib/database/mongo";
import permissionCheck from "$lib/utils/permissionCheck";
import { error } from "@sveltejs/kit";
import { type Collection } from "mongodb";

const users: Collection<User> = loadCollection("accounts", "users");
const folders: Collection<Folder> = loadCollection("documents", "folders");
const sets: Collection<Set> = loadCollection("documents", "sets");

export async function DELETE({ params, locals, fetch }) {
    if (!locals.session) error(401, "Unauthorized.");

    const folder: Folder = await (await fetch(`/api/documents/folder/${params.id}`)).json();

    if (!permissionCheck(folder, locals.user._id, true))
        error(403, "You do not have permission to delete this folder.");

    await folders.deleteOne({
        _id: params.id,
    });

    await users.updateOne(
        { _id: locals.user._id },
        {
            // For some reason a type error is thrown here, but it works fine
            // @ts-ignore
            $pull: {
                folders: params.id,
            },
        }
    );

    // Also update all sets that are linked to the folder
    await sets.updateMany(
        { folder: { $in: [params.id] } },
        {
            // For some reason a type error is thrown here, but it works fine
            // @ts-ignore
            $pull: {
                folder: params.id,
            },
        }
    );

    return new Response(null, {
        status: 204,
    });
}

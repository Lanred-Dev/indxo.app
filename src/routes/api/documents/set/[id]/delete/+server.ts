import { error } from "@sveltejs/kit";
import { loadCollection } from "$lib/database/mongo";
import { ObjectId, type Collection } from "mongodb";
import type { Set } from "$lib/database/documents/Set";
import type { User } from "$lib/database/documents/User";
import permissionCheck from "$lib/utils/permissionCheck";

const users: Collection<User> = loadCollection("accounts", "users");
const sets: Collection<Set> = loadCollection("documents", "sets");

export async function DELETE({ params, locals, fetch }) {
    const set: Set = await (await fetch(`/api/documents/set/${params.id}`)).json();

    if (!permissionCheck(set, locals.user._id, true))
        error(403, "You do not have permission to delete this set.");

    const id: ObjectId = new ObjectId(params.id);

    await sets.deleteOne({
        _id: id,
    });

    await users.updateOne(
        { _id: locals.user._id },
        {
            // For some reason a type error is thrown here, but it works fine
            // @ts-ignore
            $pull: {
                sets: id,
            },
        }
    );

    return new Response(null, {
        status: 204,
    });
}

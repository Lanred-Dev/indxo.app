import { error } from "@sveltejs/kit";
import type { SortingTerm, User } from "$lib/database/documents/User";
import type { Set } from "$lib/database/documents/Set";
import permissionCheck from "$lib/utils/permissionCheck";
import type { Collection } from "mongodb";
import { loadCollection } from "$lib/database/mongo";

const users: Collection<User> = loadCollection("accounts", "users");

export async function POST({ params, request, locals, fetch }) {
    if (!locals.session) error(401, "Unauthorized.");

    const set: Set = await (await fetch(`/api/documents/set/${params.id}`)).json();

    if (!permissionCheck(set, locals.user._id))
        error(403, "You do not have permission to view this set.");

    const sorting: SortingTerm[] = await request.json();
    const ids: string[] = [];

    // Remove duplicates
    sorting.forEach(([id], index) => {
        if (!ids.includes(id)) return ids.push(id);

        sorting.splice(index, 1);
    });

    users.updateOne(
        {
            _id: locals.user._id,
        },
        {
            $set: {
                [`sorting.${params.id}`]: sorting,
            },
        }
    );

    return new Response(null, {
        status: 204,
    });
}

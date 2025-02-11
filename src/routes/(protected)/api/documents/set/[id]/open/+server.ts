import { json } from "@sveltejs/kit";
import { loadCollection } from "$lib/database/mongo";
import type { User } from "$lib/database/documents/User";
import { ObjectId, type Collection } from "mongodb";
import idToDocument from "$lib/utils/idToDocument";

const users: Collection<User> = loadCollection("accounts", "users");

export async function GET({ params, fetch, locals }) {
    const response = await fetch(`/api/documents/set/${params.id}`);

    if (response.status !== 200) {
        return json({
            success: false,
        });
    }

    const setID: ObjectId = new ObjectId(params.id);
    const user: User = await idToDocument("users", locals.userID);
    const openedSets = user.openedSets.filter((set) => {
        return set[0] !== setID;
    });

    openedSets.push([setID, new Date().getTime()]);

    await users.updateOne(
        { _id: locals.userID },
        {
            $set: {
                openedSets,
            },
        }
    );

    return json({
        success: true,
    });
}

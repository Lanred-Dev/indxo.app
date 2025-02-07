import { json } from "@sveltejs/kit";
import { loadCollection } from "$lib/database/mongo";
import { ObjectId, type Collection } from "mongodb";
import { updatableFields, type Set } from "$lib/database/documents/Set";
import type { User } from "$lib/database/documents/User";

const users: Collection<User> = loadCollection("accounts", "users");
const sets: Collection<Set> = loadCollection("documents", "sets");

export async function POST({ params, request }) {
    const newFields: { [key: string]: any } = await request.json();
    const validFields: { [key: string]: any } = {};
    const id: ObjectId = new ObjectId(params.id);

    for (const key in newFields) {
        if (!(key in updatableFields) || typeof newFields[key] !== updatableFields[key]) continue;

        validFields[key] = newFields[key];
    }

    await sets.updateOne(
        {
            _id: id,
        },
        {
            $set: validFields,
        }
    );

    return json({
        success: true,
    });
}

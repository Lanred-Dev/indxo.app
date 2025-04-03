import { error, json } from "@sveltejs/kit";
import { loadCollection } from "$lib/database/mongo";
import { type Collection } from "mongodb";
import type { Set } from "$lib/database/documents/Set";
import type { User } from "$lib/database/documents/User";
import generateRandomID from "$lib/utils/generateRandomID.js";

const users: Collection<User> = loadCollection("accounts", "users");
const sets: Collection<Set> = loadCollection("documents", "sets");

export async function POST({ request, locals }) {
    if (!locals.session) error(401, "Unauthorized.");

    const {
        name,
        subject,
        description,
        isPublic,
    }: { name: string; subject: string; description: string; isPublic: boolean } =
        await request.json();
    const id: string = generateRandomID();

    await sets.insertOne({
        _id: id,
        name: name.length > 0 ? name : "Untitled",
        description: description.length > 0 ? description : "No description",
        subject,
        isPublic,
        terms: [],
        owner: locals.user._id,
        created: Date.now(),
        folder: [],
    });

    await users.updateOne(
        { _id: locals.user._id },
        {
            // For some reason a type error is thrown here, but it works fine
            // @ts-ignore
            $push: {
                sets: id,
            },
        }
    );

    return json(id, {
        status: 201,
    });
}

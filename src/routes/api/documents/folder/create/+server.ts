import type { Folder } from "$lib/database/documents/Folder";
import type { User } from "$lib/database/documents/User";
import { loadCollection } from "$lib/database/mongo";
import generateRandomID from "$lib/utils/generateRandomID.js";
import { error, json } from "@sveltejs/kit";
import { type Collection } from "mongodb";

const users: Collection<User> = loadCollection("accounts", "users");
const folders: Collection<Folder> = loadCollection("documents", "folders");

export async function POST({ request, locals }) {
    if (!locals.session) error(401, "Unauthorized.");

    const {
        name,
        icon,
        description,
        isPublic,
    }: { name: string; icon: string; description: string; isPublic: boolean } =
        await request.json();
    const id: string = generateRandomID(15, "f");

    await folders.insertOne({
        _id: id,
        name: name.length > 0 ? name : "Untitled",
        description: description.length > 0 ? description : "No description",
        icon,
        isPublic,
        sets: [],
        owner: locals.user._id,
        created: Date.now(),
    });

    await users.updateOne(
        { _id: locals.user._id },
        {
            // For some reason a type error is thrown here, but it works fine
            // @ts-ignore
            $push: {
                folders: id,
            },
        }
    );

    return json(id, {
        status: 201,
    });
}

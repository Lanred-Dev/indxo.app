import { json } from "@sveltejs/kit";
import { loadCollection } from "$lib/database/mongo";
import { ObjectId, type Collection } from "mongodb";
import type { User } from "$lib/database/documents/User";
import type { Folder } from "$lib/database/documents/Folder";

const users: Collection<User> = loadCollection("accounts", "users");
const folders: Collection<Folder> = loadCollection("documents", "folders");

export async function POST({ request, locals }) {
    const {
        name,
        icon,
        description,
        isPublic,
    }: { name: string; icon: string; description: string; isPublic: boolean } =
        await request.json();

    const folderID: ObjectId = new ObjectId();

    await folders.insertOne({
        _id: folderID,
        name,
        description,
        icon,
        public: isPublic,
        sets: [],
        owner: { name: locals.session.user.name, email: locals.session.user.email },
        created: new Date().getTime(),
    });

    await users.updateOne(
        { email: locals.session.user.email },
        {
            // @ts-ignore
            $push: {
                folders: { _id: folderID },
            },
        }
    );

    return json({
        success: true,
        linkTo: `/folders/${folderID}`,
    });
}

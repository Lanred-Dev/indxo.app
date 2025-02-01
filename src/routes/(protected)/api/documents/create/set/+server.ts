import { json } from "@sveltejs/kit";
import { loadCollection } from "$lib/database/mongo";
import { ObjectId, type Collection } from "mongodb";
import type { Set } from "$lib/database/documents/Set";
import type { User } from "$lib/database/documents/User";

const users: Collection<User> = loadCollection("accounts", "users");
const sets: Collection<Set> = loadCollection("documents", "sets");

export async function POST({ request, locals }) {
    const {
        name,
        subject,
        description,
        isPublic,
    }: { name: string; subject: string; description: string; isPublic: boolean } =
        await request.json();

    const setID: ObjectId = new ObjectId();

    await sets.insertOne({
        _id: setID,
        name,
        description,
        subject,
        public: isPublic,
        terms: [],
        owner: { name: locals.session.user.name, email: locals.session.user.email },
        created: new Date().getTime(),
    });

    await users.updateOne(
        { email: locals.session.user.email },
        {
            // @ts-ignore
            $push: {
                sets: { _id: setID },
            },
        }
    );

    return json({
        success: true,
        linkTo: `/sets/${setID}`,
    });
}

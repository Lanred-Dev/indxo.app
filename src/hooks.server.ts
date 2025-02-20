import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "$env/static/private";
import type { Handle } from "@sveltejs/kit";
import { SvelteKitAuth, type Profile, type Session } from "@auth/sveltekit";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import Google from "@auth/sveltekit/providers/google";
import mongo from "$lib/database/mongo";
import { sequence } from "@sveltejs/kit/hooks";
import { dev } from "$app/environment";
import type { Collection } from "mongodb";
import { fields, type User } from "$lib/database/documents/User";
import { loadCollection } from "$lib/database/mongo";

const users: Collection<User> = loadCollection("accounts", "users");

/**
 * This hook adds the session to the locals so that it is available in the load functions.
 *
 * @param event The event object.
 * @returns The result of the resolve function.
 */
const addSessionToLocals: Handle = async ({ event, resolve }) => {
    const session: Session | null = await event.locals.auth();
    event.locals.session = session;

    // Add the user id to the locals if the user is signed in.
    if (session?.user?.email) {
        const user: User | null = await users.findOne({ email: session.user?.email });
        event.locals.userID = user?._id;
    }

    return await resolve(event);
};

/**
 * Compares the current user's fields to the fields array and updates the user with any missing fields.
 *
 * @param email The email of the user to update.
 * @returns
 */
async function updateUserWithFields(email: string) {
    const user = await users.findOne({ email: email });

    if (!user) return;

    const missingFields = fields.filter((field) => user[field[0]] === undefined);

    await users.updateOne(
        {
            email,
        },
        {
            $set: {
                ...Object.fromEntries(
                    missingFields.map((field) => [
                        field[0],
                        field[1] === "array" ? [] : field[1] === "boolean" ? false : "",
                    ])
                ),
            },
        }
    );

    return user;
}

export const handle = sequence(
    SvelteKitAuth({
        trustHost: true,
        providers: [
            Google({
                clientId: GOOGLE_CLIENT_ID,
                clientSecret: GOOGLE_CLIENT_SECRET,
                redirectProxyUrl: dev ? "http://localhost:3000/auth" : "https://indxo.app/auth",
            }),
        ],
        adapter: MongoDBAdapter(mongo, { databaseName: "accounts" }),
        pages: {
            signIn: "/login",
        },
        callbacks: {
            async signIn({ profile }) {
                if (typeof profile?.email !== "string") {
                    return false;
                }

                const user = await updateUserWithFields(profile.email || "");

                // If the user is banned, do not let them sign in.
                return !user?.banned || true;
            },
        },
        events: {
            createUser: async ({ user }) => {
                await updateUserWithFields(user.email || "");
            },
        },
    }).handle,
    addSessionToLocals
);

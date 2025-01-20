import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "$env/static/private";
import type { Handle } from "@sveltejs/kit";
import { SvelteKitAuth, type Session } from "@auth/sveltekit";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import Google from "@auth/sveltekit/providers/google";
import mongo from "$lib/database/mongo";
import { sequence } from "@sveltejs/kit/hooks";
import { dev } from "$app/environment";

//
const addSessionToLocals: Handle = async ({ event, resolve }) => {
    const session: Session | null = await event.locals.auth();
    event.locals.session = session;

    return await resolve(event);
};

export const handle = sequence(
    SvelteKitAuth({
        trustHost: true,
        providers: [
            Google({
                clientId: GOOGLE_CLIENT_ID,
                clientSecret: GOOGLE_CLIENT_SECRET,
                redirectProxyUrl: dev
                    ? "http://localhost:3000/auth"
                    : "https://cards.indxo.app/auth",
            }),
        ],
        adapter: MongoDBAdapter(mongo, { databaseName: "accounts" }),
        pages: {
            signIn: "/login",
        },
    }).handle,
    addSessionToLocals
);

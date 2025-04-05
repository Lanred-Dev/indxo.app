import { dev } from "$app/environment";
import type { User } from "$lib/database/documents/User.js";
import { loadCollection } from "$lib/database/mongo.js";
import { error, redirect } from "@sveltejs/kit";
import { type Collection } from "mongodb";
import { validateToken, deleteSession } from "$lib/auth/session";

const users: Collection<User> = loadCollection("accounts", "users");

export async function GET({ cookies }) {
    const token: string | null = cookies.get("session") ?? null;

    if (!token) redirect(401, "/");

    const validation = await validateToken(token);

    if (!validation) redirect(401, "/");

    deleteSession(validation.session._id);
    cookies.set("session", "", {
        httpOnly: true,
        path: "/",
        secure: !dev,
        sameSite: "lax",
        maxAge: 0,
    });

    redirect(302, "/");
}

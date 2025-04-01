import type { Handle } from "@sveltejs/kit";
import { dev } from "$app/environment";
import { validateToken } from "$lib/auth/session";
import { ObjectId } from "mongodb";

export const auth: Handle = async ({ event, resolve }) => {
    const token: string | null = event.cookies.get("session-token") ?? null;

    // If the token is not set, set the user and session to null and return.
    if (!token) {
        event.locals.session = null;
        event.locals.user = {
            _id: new ObjectId(),
            name: "",
            image: "",
        };

        return resolve(event);
    }

    const validation = await validateToken(token);

    if (validation !== null) {
        event.locals.session = validation.session;
        event.locals.user = {
            _id: validation.user._id,
            name: validation.user.name,
            image: validation.user.image,
        };

        event.cookies.set("session-token", token, {
            httpOnly: true,
            path: "/",
            secure: !dev,
            sameSite: "lax",
            expires: validation.session.expires,
        });
    } else {
        event.locals.session = null;
        event.locals.user = {
            _id: new ObjectId(),
            name: "",
            image: "",
        };

        event.cookies.set("session-token", "", {
            httpOnly: true,
            path: "/",
            secure: !dev,
            sameSite: "lax",
            maxAge: 0,
        });
    }

    return resolve(event);
};

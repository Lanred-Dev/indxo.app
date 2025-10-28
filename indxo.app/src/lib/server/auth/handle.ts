import { dev } from "$app/environment";
import { emptySessionUser } from "$lib/documents";
import type { Handle } from "@sveltejs/kit";
import { validateToken } from "./session";

export const handle: Handle = async ({ event, resolve }) => {
    const token = event.cookies.get("session");

    // If the token is not set, set the user and session to null and return.
    if (!token) {
        event.locals.session = null;
        event.locals.user = emptySessionUser;
        return resolve(event);
    }

    const sessionInformation = await validateToken(token);

    if (sessionInformation) {
        event.locals.session = sessionInformation.session;
        event.locals.user = {
            _id: sessionInformation.user._id,
            name: sessionInformation.user.name,
            picture: sessionInformation.user.picture,
            email: sessionInformation.user.email,
            preferences: sessionInformation.user.preferences,
            favorites: sessionInformation.user.favorites,
        };

        event.cookies.set("session", token, {
            httpOnly: true,
            path: "/",
            secure: !dev,
            sameSite: "lax",
            expires: new Date(sessionInformation.session.expires),
        });
    } else {
        event.locals.session = null;
        event.locals.user = emptySessionUser;

        event.cookies.set("session", "", {
            path: "/",
            secure: !dev,
            maxAge: 0,
        });
    }

    return resolve(event);
};

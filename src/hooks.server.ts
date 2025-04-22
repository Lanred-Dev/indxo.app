import { dev } from "$app/environment";
import { validateToken } from "$lib/auth/session";
import type { SimpleUserWithEmail } from "$lib/database/documents/User";
import type { Handle } from "@sveltejs/kit";

const BLANK_USER: SimpleUserWithEmail = {
    _id: "",
    name: "",
    image: "",
    email: "",
};

export const handle: Handle = async ({ event, resolve }) => {
    const token: string | null = event.cookies.get("session") ?? null;

    // If the token is not set, set the user and session to null and return.
    if (!token) {
        event.locals.session = null;
        event.locals.user = BLANK_USER;

        return resolve(event);
    }

    const validation = await validateToken(token);

    if (validation) {
        event.locals.session = validation.session;
        event.locals.user = {
            _id: validation.user._id,
            name: validation.user.name,
            image: validation.user.image,
            email: validation.user.email,
        };

        event.cookies.set("session", token, {
            httpOnly: true,
            path: "/",
            secure: !dev,
            sameSite: "lax",
            expires: new Date(validation.session.expires),
        });
    } else {
        event.locals.session = null;
        event.locals.user = BLANK_USER;

        event.cookies.set("session", "", {
            httpOnly: true,
            path: "/",
            secure: !dev,
            sameSite: "lax",
            maxAge: 0,
        });
    }

    return resolve(event);
};

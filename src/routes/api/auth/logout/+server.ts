import { dev } from "$app/environment";
import { deleteSession, validateToken } from "$lib/server/auth/session.js";
import { ResponseCodes, ResponseMessages } from "$lib/utils/apiResponses.js";
import { error, redirect } from "@sveltejs/kit";

export async function GET({ cookies }) {
    const token = cookies.get("session");

    if (!token) error(ResponseCodes.Unauthorized, ResponseMessages.Unauthorized);

    const validation = await validateToken(token);

    if (!validation) error(ResponseCodes.Unauthorized, ResponseMessages.Unauthorized);

    deleteSession(validation.session._id);
    cookies.set("session", "", {
        httpOnly: true,
        path: "/",
        secure: !dev,
        sameSite: "lax",
        maxAge: 0,
    });

    redirect(ResponseCodes.Redirect, "/");
}

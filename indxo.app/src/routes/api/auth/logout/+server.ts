import { dev } from "$app/environment";
import { deleteSession, validateToken } from "$lib/server/auth/session";
import { ResponseCodes } from "$lib/utils/apiResponses";
import { error, redirect } from "@sveltejs/kit";

export async function GET({ cookies }) {
    const token = cookies.get("session");

    if (!token) error(ResponseCodes.BadRequest, "No session token provided.");

    const validation = await validateToken(token);

    if (!validation) error(ResponseCodes.BadRequest, "Invalid session token.");

    await deleteSession(validation.session._id);
    cookies.set("session", "", {
        httpOnly: true,
        path: "/",
        secure: !dev,
        sameSite: "lax",
        maxAge: 0,
        domain: dev ? "localhost" : "indxo.app",
    });

    redirect(ResponseCodes.Redirect, "/");
}

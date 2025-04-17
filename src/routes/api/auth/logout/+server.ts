import { dev } from "$app/environment";
import { deleteSession, validateToken } from "$lib/auth/session";
import { error, redirect } from "@sveltejs/kit";

export async function GET({ cookies }) {
    const token: string | null = cookies.get("session") ?? null;

    if (!token) error(401, "Not logged in.");

    const validation = await validateToken(token);

    if (!validation) error(401, "Token is invalid.");

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

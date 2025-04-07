import { dev } from "$app/environment";
import { error, redirect } from "@sveltejs/kit";
import { validateToken, deleteSession } from "$lib/auth/session";

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

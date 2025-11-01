import { dev } from "$app/environment";
import { deleteSession, validateToken } from "$lib/server/auth/session";
import { ResponseCodes } from "$lib/utils/apiResponses";
import { error, redirect } from "@sveltejs/kit";

export const actions = {
    default: async ({ cookies }) => {
        const token = cookies.get("session");

        if (!token) error(ResponseCodes.BadRequest, "No session token provided.");

        const validation = await validateToken(token);

        if (!validation) error(ResponseCodes.BadRequest, "Invalid session token.");

        await deleteSession(validation.session._id);

        cookies.delete("session", {
            httpOnly: true,
            path: "/",
            sameSite: "lax",
            secure: !dev,
        });

        redirect(ResponseCodes.Redirect, "/");
    },
};

export function load({ locals }) {
    if (!locals.session) redirect(ResponseCodes.Redirect, "/login");
}

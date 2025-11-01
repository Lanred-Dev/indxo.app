import { google } from "$lib/server/auth/oauth";
import { ResponseCodes } from "$lib/utils/apiResponses";
import { redirect } from "@sveltejs/kit";
import { generateCodeVerifier, generateState } from "arctic";

export const actions = {
    default: async ({ cookies }) => {
        const state = generateState();
        const verifier = generateCodeVerifier();
        const url = google.createAuthorizationURL(state, verifier, ["openid", "profile", "email"]);

        cookies.set("state", state, {
            path: "/",
            httpOnly: true,
            maxAge: 60000,
            sameSite: "lax",
        });

        cookies.set("verifier", verifier, {
            path: "/",
            httpOnly: true,
            maxAge: 60000,
            sameSite: "lax",
        });

        redirect(ResponseCodes.Redirect, url);
    },
};

export function load({ locals }) {
    if (locals.session) redirect(ResponseCodes.Redirect, "/");
}

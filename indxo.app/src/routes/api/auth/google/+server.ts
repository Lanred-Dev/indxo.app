import { dev } from "$app/environment";
import { google } from "$lib/server/auth/oauth";
import { ResponseCodes } from "$lib/utils/apiResponses";
import { redirect } from "@sveltejs/kit";
import { generateCodeVerifier, generateState } from "arctic";

export async function GET({ cookies }) {
    const state = generateState();
    const verifier = generateCodeVerifier();
    const url = google.createAuthorizationURL(state, verifier, ["openid", "profile", "email"]);

    cookies.set("state", state, {
        path: "/",
        httpOnly: true,
        maxAge: 60000,
        sameSite: "lax",
        secure: !dev,
    });

    cookies.set("verifier", verifier, {
        path: "/",
        httpOnly: true,
        maxAge: 60000,
        sameSite: "lax",
        secure: !dev,
        domain: dev ? "localhost" : "indxo.app",
    });

    redirect(ResponseCodes.Redirect, url);
}

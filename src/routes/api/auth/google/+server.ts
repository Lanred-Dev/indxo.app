import { dev } from "$app/environment";
import { google } from "$lib/auth/oauth";
import { redirect } from "@sveltejs/kit";
import { generateCodeVerifier, generateState } from "arctic";

export async function GET({ cookies }) {
    const state: string = generateState();
    const verifier: string = generateCodeVerifier();
    const url: URL = google.createAuthorizationURL(state, verifier, ["openid", "profile", "email"]);

    cookies.set("google-state", state, {
        path: "/",
        httpOnly: true,
        maxAge: 60000,
        sameSite: "lax",
        secure: !dev,
    });

    cookies.set("google-verifier", verifier, {
        path: "/",
        httpOnly: true,
        maxAge: 60000,
        sameSite: "lax",
        secure: !dev,
    });

    redirect(302, url);
}

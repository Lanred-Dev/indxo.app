import { generateState, generateCodeVerifier } from "arctic";
import { google } from "$lib/auth/oauth";
import { redirect } from "@sveltejs/kit";

export async function GET({ cookies }) {
    const state: string = generateState();
    const verifier: string = generateCodeVerifier();
    const url: URL = google.createAuthorizationURL(state, verifier, ["openid", "profile", "email"]);

    cookies.set("google-state", state, {
        path: "/",
        httpOnly: true,
        maxAge: 60000,
        sameSite: "lax",
    });

    cookies.set("google-verifier", verifier, {
        path: "/",
        httpOnly: true,
        maxAge: 60000,
        sameSite: "lax",
    });

    return redirect(302, url);
}

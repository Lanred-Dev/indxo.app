import { generateState, generateCodeVerifier } from "arctic";
import { google } from "$lib/auth/oauth";

export async function GET({ cookies }) {
    const state = generateState();
    const codeVerifier = generateCodeVerifier();
    const url = google.createAuthorizationURL(state, codeVerifier, ["openid", "profile"]);

    cookies.set("google_oauth_state", state, {
        path: "/",
        httpOnly: true,
        maxAge: 60000,
        sameSite: "lax",
    });

    cookies.set("google_code_verifier", codeVerifier, {
        path: "/",
        httpOnly: true,
        maxAge: 60000,
        sameSite: "lax",
    });

    return new Response(null, {
        status: 302,
        headers: {
            location: url.toString(),
        },
    });
}

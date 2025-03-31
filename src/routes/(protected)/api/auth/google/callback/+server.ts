import { google } from "$lib/auth/oauth";
import type { User } from "$lib/database/documents/User.js";
import { loadCollection } from "$lib/database/mongo.js";
import { json } from "@sveltejs/kit";
import { decodeIdToken, type OAuth2Tokens } from "arctic";
import type { Collection } from "mongodb";

const users: Collection<User> = loadCollection("accounts", "users");

export async function GET({ cookies, url }) {
    const storedState = cookies.get("google_oauth_state") ?? null;
    const codeVerifier = cookies.get("google_code_verifier") ?? null;
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");

    // Validate the parameters
    if (
        storedState === null ||
        codeVerifier === null ||
        code === null ||
        state === null ||
        storedState !== state
    )
        return json(json({ success: false }, { status: 400 }));

    let tokens: OAuth2Tokens;

    try {
        tokens = await google.validateAuthorizationCode(code, codeVerifier);
    } catch (e) {
        return json(json({ success: false }, { status: 400 }));
    }

    const claims = decodeIdToken(tokens.idToken());

    console.log(claims);

    const user: User | null = null;
}

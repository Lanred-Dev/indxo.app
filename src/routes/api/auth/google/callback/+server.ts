import { dev } from "$app/environment";
import { google } from "$lib/auth/oauth";
import { createSession, generateToken } from "$lib/auth/session.js";
import type { Session } from "$lib/database/documents/Session.js";
import type { User } from "$lib/database/documents/User.js";
import { loadCollection } from "$lib/database/mongo.js";
import generateRandomID from "$lib/utils/generateRandomID.js";
import { error, redirect } from "@sveltejs/kit";
import { decodeIdToken, type OAuth2Tokens } from "arctic";
import { type Collection } from "mongodb";

const users: Collection<User> = loadCollection("accounts", "users");

export async function GET({ cookies, url }) {
    const oauthState: string | null = cookies.get("google-state") ?? null;
    const oauthVerifier: string | null = cookies.get("google-verifier") ?? null;
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");

    // Validate the parameters
    if (!oauthState || !oauthVerifier || !code || !state || oauthState !== state)
        error(400, "Invalid state");

    let tokens: OAuth2Tokens;

    try {
        tokens = await google.validateAuthorizationCode(code, oauthVerifier);
    } catch (_error) {
        error(500, "Failed to validate authorization code");
    }

    const claims: {
        iss: string;
        azp: string;
        aud: string;
        sub: string;
        at_hash: string;
        name: string;
        picture: string;
        given_name: string;
        family_name: string;
        iat: number;
        exp: number;
        email: string;
    } = decodeIdToken(tokens.idToken()) as any;

    let user: User | null = await users.findOne({
        email: claims.email,
    });

    // If the user doesn't exist, create a new user because they are logging in for the first time
    if (!user) {
        user = {
            _id: generateRandomID(),
            google: claims.sub,
            name: claims.name,
            email: claims.email,
            image: claims.picture,
            banned: false,
            sets: [],
            folders: [],
            favorites: [],
            homeSectionPreferences: [],
            openedSets: [],
            setData: [],
        };

        await users.insertOne(user);
    }

    const token: string = generateToken();
    const session: Session = await createSession(token, user._id);

    cookies.set("session", token, {
        httpOnly: true,
        path: "/",
        sameSite: "lax",
        secure: !dev,
        expires: new Date(session.expires),
    });

    redirect(302, "/");
}

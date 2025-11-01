import { dev } from "$app/environment";
import { DocumentType, type User } from "$lib/documents";
import { google } from "$lib/server/auth/oauth";
import { createSession, generateToken } from "$lib/server/auth/session";
import { loadCollection } from "$lib/server/mongo";
import { ResponseCodes } from "$lib/utils/apiResponses";
import generateDocumentID from "$lib/utils/document/generateID";
import { error, redirect } from "@sveltejs/kit";
import { decodeIdToken, type OAuth2Tokens } from "arctic";
import { type Collection } from "mongodb";

const users: Collection<User> = loadCollection("accounts", "users");

export async function GET({ cookies, url }) {
    const oauthState = cookies.get("state");
    const oauthVerifier = cookies.get("verifier");
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");

    if (!oauthState || !oauthVerifier || !code || !state || oauthState !== state)
        error(ResponseCodes.BadRequest, "Invalid state.");

    let tokens: OAuth2Tokens;

    try {
        tokens = await google.validateAuthorizationCode(code, oauthVerifier);
    } catch {
        error(ResponseCodes.ServerError, "Failed to validate authorization code.");
    }

    cookies.set("state", "", {
        path: "/",
        maxAge: 0,
    });

    cookies.set("verifier", "", {
        path: "/",
        maxAge: 0,
    });

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

    // If the user doesn't exist, this is a new user
    if (!user) {
        user = {
            _id: generateDocumentID(15, DocumentType.user),
            googleID: claims.sub,
            name: claims.name,
            email: claims.email,
            picture: claims.picture,
            sets: [],
            folders: [],
            favorites: [],
            preferences: {
                strugglingTermThreshold: 0,
                home: [],
            },
            created: Date.now(),
            metadata: {
                documentsOpenedAt: {},
                sets: {},
            },
        };

        await users.insertOne(user);
    }

    const token: string = generateToken();
    const session = await createSession(token, user._id);

    cookies.set("session", token, {
        httpOnly: true,
        path: "/",
        sameSite: "lax",
        secure: !dev,
        expires: new Date(session.expires),
        domain: dev ? "localhost" : "indxo.app",
    });

    redirect(ResponseCodes.Redirect, "/");
}

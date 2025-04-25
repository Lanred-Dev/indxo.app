import type { Session } from "$lib/database/documents/Session";
import type { User } from "$lib/database/documents/User";
import { loadCollection } from "$lib/database/mongo";
import idToDocument from "$lib/utils/idToDocument";
import { sha256 } from "@oslojs/crypto/sha2";
import { encodeBase32LowerCase, encodeHexLowerCase } from "@oslojs/encoding";
import { milliseconds } from "date-fns";
import { type Collection } from "mongodb";
import { checkUserForUpdates } from "./user";

const sessions: Collection<Session> = loadCollection("accounts", "sessions");

/**
 * Encodes a token using SHA-256.
 *
 * @param token The token to encode
 * @returns  The encoded token as a string
 */
function encodeToken(token: string): string {
    return encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
}

/**
 * Creates a new session for a user.
 *
 * @param token The token to use
 * @param userID The user ID to associate with the session
 * @returns A promise that resolves to the created session
 */
export async function createSession(token: string, userID: string): Promise<Session> {
    const session: Session = {
        _id: encodeToken(token),
        user: userID,
        expires: Date.now() + milliseconds({ days: 30 }),
    };

    await sessions.insertOne(session);

    return session;
}

/**
 * Validates a session token and retrieves the associated user and session data.
 *
 * @param token The token to validate
 * @returns A promise that resolves to an object containing the user and session if valid, or null if invalid or expired.
 */
export async function validateToken(
    token: string
): Promise<{ user: User; session: Session } | null> {
    const session: Session = await idToDocument("sessions", encodeToken(token));

    if (!session) return null;

    if (Date.now() >= session.expires) {
        deleteSession(token);
        return null;
    }

    // If the session is within 10 days of expiration, extend it by 30, because this session is still in use.
    if (Date.now() >= session.expires - milliseconds({ days: 10 })) {
        session.expires = Date.now() + milliseconds({ days: 30 });

        await sessions.updateOne({ _id: session._id }, { $set: { expires: session.expires } });
    }

    const user: User = await idToDocument("users", session.user);
    checkUserForUpdates(user);

    return { user, session };
}

/**
 * Deletes a session by its token.
 *
 * @param token The token to delete
 * @returns never
 */
export async function deleteSession(token: string) {
    await sessions.deleteOne({
        _id: encodeHexLowerCase(sha256(new TextEncoder().encode(token))),
    });
}

/**
 * Generates a random token.
 *
 * @returns A randomly generated token.
 */
export function generateToken(): string {
    const bytes = new Uint8Array(20);
    crypto.getRandomValues(bytes);
    return encodeBase32LowerCase(bytes);
}

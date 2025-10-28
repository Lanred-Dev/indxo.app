import { userFields, type Session, type User } from "$lib/documents";
import { loadCollection } from "$lib/server/mongo";
import { resolveMissingDocumentFields } from "$lib/utils/document/fields";
import { sha256 } from "@oslojs/crypto/sha2";
import { encodeBase32LowerCase, encodeHexLowerCase } from "@oslojs/encoding";
import { milliseconds } from "date-fns";
import { type Collection } from "mongodb";
import { findDocumentByID } from "../utils/document/findByID";

const sessions: Collection<Session> = loadCollection("accounts", "sessions");
const users: Collection<User> = loadCollection("accounts", "users");

/**
 * Encodes a token using SHA-256.
 *
 * @param token
 * @returns The encoded token
 */
function encodeToken(token: string): string {
    return encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
}

/**
 * Creates a new session for a user.
 *
 * @param token
 * @param user
 * @returns The created session
 */
export async function createSession(token: string, user: string): Promise<Session> {
    const session: Session = {
        _id: encodeToken(token),
        user,
        expires: Date.now() + milliseconds({ days: 30 }),
    };

    await sessions.insertOne(session);

    return session;
}

/**
 * Validates a session token and retrieves the associated user and session data.
 *
 * @param token
 * @returns An object containing the user and session if valid, or null if invalid or expired.
 */
export async function validateToken(
    token: string
): Promise<{ user: User; session: Session } | null> {
    const session: Session | null = await sessions.findOne({ _id: encodeToken(token) });

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

    // Check and ensure the user document has all required fields
    const [user, changesMade] = resolveMissingDocumentFields(
        await findDocumentByID(session.user),
        userFields
    );

    if (changesMade) await users.updateOne({ _id: session.user }, { $set: user });

    return { user: user as User, session };
}

/**
 * Deletes a session by its token.
 *
 * @param token
 */
export async function deleteSession(token: string) {
    await sessions.deleteOne({
        _id: encodeToken(token),
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

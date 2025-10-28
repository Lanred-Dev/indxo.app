import { sha256 } from "@oslojs/crypto/sha2";
import { encodeHexLowerCase } from "@oslojs/encoding";
import { milliseconds } from "date-fns";
import { onRequestAsyncHookHandler } from "fastify";
import { Collection } from "mongodb";
import { Session } from "./documents/Session";
import { User } from "./documents/User";
import { loadCollection } from "./mongo";

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
 * Validates a session token and retrieves the associated user and session data.
 *
 * @param token
 * @returns An object containing the user and session if valid, or null if invalid or expired.
 */
export async function validateToken(token: string): Promise<User | null> {
    const session: Session | null = await sessions.findOne({ _id: encodeToken(token) });

    if (!session) return null;

    if (Date.now() >= session.expires) return null;

    // If the session is within 10 days of expiration, extend it by 30, because this session is still in use.
    if (Date.now() >= session.expires - milliseconds({ days: 10 })) {
        session.expires = Date.now() + milliseconds({ days: 30 });

        await sessions.updateOne({ _id: session._id }, { $set: { expires: session.expires } });
    }

    const user: User = (await users.findOne({ _id: session.user })) as unknown as User;
    return user;
}

export const hook: onRequestAsyncHookHandler = async (request, _reply) => {
    const token = request.cookies.session;

    if (!token) {
        request.user = null;
        return;
    }

    const user = await validateToken(token);
    request.user = user
        ? {
              _id: user._id,
          }
        : null;
};

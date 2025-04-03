import { encodeBase32, encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import idToDocument from "$lib/utils/idToDocument";
import type { Session } from "$lib/database/documents/Session";
import type { User } from "$lib/database/documents/User";
import { type Collection } from "mongodb";
import { loadCollection } from "$lib/database/mongo";
import { milliseconds } from "date-fns";

const sessions: Collection<Session> = loadCollection("accounts", "sessions");

function encodeToken(token: string): string {
    return encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
}

export async function createSession(token: string, userID: string): Promise<Session> {
    const session: Session = {
        _id: encodeToken(token),
        user: userID,
        expires: Date.now() + milliseconds({ days: 30 }),
    };

    await sessions.insertOne(session);

    return session;
}

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
    return { user, session };
}

export async function deleteSession(token: string) {
    await sessions.deleteOne({
        _id: encodeHexLowerCase(sha256(new TextEncoder().encode(token))),
    });
}

export function generateToken(): string {
    const bytes = new Uint8Array(20);
    crypto.getRandomValues(bytes);
    return encodeBase32(bytes).toLowerCase();
}

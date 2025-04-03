import { encodeBase32, encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import idToDocument from "$lib/utils/idToDocument";
import type { Session } from "$lib/database/documents/Session";
import type { User } from "$lib/database/documents/User";
import { ObjectId, type Collection } from "mongodb";
import { loadCollection } from "$lib/database/mongo";
import { milliseconds } from "date-fns";

const sessions: Collection<Session> = loadCollection("accounts", "sessions");

export async function createSession(token: string, userID: ObjectId): Promise<Session> {
    const sessionID: string = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
    const session: Session = {
        _id: sessionID,
        user: userID,
        expires: Date.now() + milliseconds({ days: 30 }),
    };

    await sessions.insertOne(session);

    return session;
}

export async function validateToken(
    token: string
): Promise<{ user: User; session: Session } | null> {
    const sessionID = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
    const session: Session = (await idToDocument("sessions", sessionID, true)) as Session;
    console.log("Session", session);
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

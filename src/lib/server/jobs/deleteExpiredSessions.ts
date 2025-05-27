import type { Session } from "$lib/documents";
import type { Collection } from "mongodb";
import cron from "node-cron";
import { loadCollection } from "../mongo";

const sessions: Collection<Session> = loadCollection("accounts", "sessions");

/**
 * A cron job that deletes expired sessions from the database every day at midnight.
 */
export default function deleteExpiredSessions() {
    cron.schedule("0 0 * * *", async () => {
        await sessions.deleteMany({
            expires: { $lt: Date.now() },
        });
    });
}

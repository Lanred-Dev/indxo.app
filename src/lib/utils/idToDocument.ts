import type { Folder } from "$lib/database/documents/Folder.ts";
import type { Session } from "$lib/database/documents/Session";
import type { Set } from "$lib/database/documents/Set.ts";
import type { User } from "$lib/database/documents/User.ts";
import { loadCollection } from "$lib/database/mongo";
import { type Collection } from "mongodb";

const users: Collection<User> = loadCollection("accounts", "users");
const sessions: Collection<Session> = loadCollection("accounts", "sessions");
const sets: Collection<Set> = loadCollection("documents", "sets");
const folders: Collection<Folder> = loadCollection("documents", "folders");

/**
 * Finds a document in a collection using its id.
 *
 * @param collectionName The name of the collection to search.
 * @param id The id of the document to find.
 * @returns The document if found, otherwise null.
 */
export default async function idToDocument(
    collectionName: "users" | "sets" | "folders" | "sessions",
    id: string
): Promise<any | null> {
    try {
        let collection:
            | Collection<User>
            | Collection<Session>
            | Collection<Set>
            | Collection<Folder>;

        switch (collectionName) {
            case "users":
                collection = users;
                break;
            case "sessions":
                collection = sessions;
                break;
            case "sets":
                collection = sets;
                break;
            case "folders":
                collection = folders;
                break;
        }

        return await collection.findOne({ _id: id.toLowerCase() });
    } catch (_error) {
        return null;
    }
}

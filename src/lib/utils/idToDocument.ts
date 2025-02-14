import { ObjectId, type Collection } from "mongodb";
import { loadCollection } from "$lib/database/mongo";
import type { User } from "$lib/database/documents/User.ts";
import type { Set } from "$lib/database/documents/Set.ts";
import type { Folder } from "$lib/database/documents/Folder.ts";

const users: Collection<User> = loadCollection("accounts", "users");
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
    collectionName: "users" | "sets" | "folders",
    id: ObjectId | string
): Promise<any> {
    try {
        const collection: Collection<any> =
            collectionName === "users" ? users : collectionName === "sets" ? sets : folders;

        return await collection.findOne({ _id: typeof id === "string" ? new ObjectId(id) : id });
    } catch (_error) {
        return null;
    }
}

import { DocumentType, type Folder, type Session, type Set, type User } from "$lib/documents";
import { loadCollection } from "$lib/server/mongo";
import { type Collection } from "mongodb";
import { determineDocumentType } from "./determineType";

const users: Collection<User> = loadCollection("accounts", "users");
const sessions: Collection<Session> = loadCollection("accounts", "sessions");
const sets: Collection<Set> = loadCollection("documents", "sets");
const folders: Collection<Folder> = loadCollection("documents", "folders");

/**
 * Finds a document in a collection using its id.
 *
 * @param id
 * @returns The document if found, otherwise null
 */
export async function findDocumentByID(id: string): Promise<any | null> {
    try {
        const documentType = determineDocumentType(id);

        let collection: Collection<any>;

        switch (documentType) {
            case DocumentType.user:
                collection = users;
                break;
            case DocumentType.folder:
                collection = folders;
                break;
            case DocumentType.set:
                collection = sets;
                break;
            case DocumentType.session:
                collection = sessions;
                break;
            // NOTE: A term document cannot be retrieved as it lives inside a set
            case DocumentType.term:
            default:
                return null;
        }

        return await collection.findOne({ _id: id });
    } catch (_error) {
        return null;
    }
}

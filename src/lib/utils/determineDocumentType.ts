import { folderIDPrefix } from "$lib/database/documents/Folder";
import { sessionIDPrefix } from "$lib/database/documents/Session";
import { setIDPrefix } from "$lib/database/documents/Set";
import { userIDPrefix } from "$lib/database/documents/User";

export const documentPrefixes: { [prefix: string]: DocumentType } = {
    [userIDPrefix]: "user",
    [setIDPrefix]: "set",
    [folderIDPrefix]: "folder",
    [sessionIDPrefix]: "session",
};

export type DocumentType = "user" | "folder" | "set" | "session" | "term";

/**
 * Determines the type of document.
 *
 * @param document The document to determine the type of.
 * @returns The document type, or null if it couldnt be determined.
 */
export default function determineDocumentType({
    _id,
}: {
    _id: string;
    [key: string]: any;
}): DocumentType | null {
    return documentPrefixes[_id[0]] ?? null;
}

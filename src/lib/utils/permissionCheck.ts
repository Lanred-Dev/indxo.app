import { ObjectId } from "mongodb";
import type { Set } from "$lib/database/documents/Set.ts";
import type { Folder } from "$lib/database/documents/Folder.ts";

/**
 * Checks if the user has permission to view/update the document.
 *
 * @param document The document to check.
 * @param userID The ID of the user to check.
 * @param mustHaveUpdatePermission Also check if the user has permission to update the document.
 * @returns If the user has permission to view the document.
 */
export default function permissionCheck(
    document: Set | Folder | null,
    userID: ObjectId,
    mustHaveUpdatePermission?: boolean
): boolean {
    if (!document) {
        return false;
    }

    if (!document.isPublic && document.owner !== userID) {
        return false;
    }

    if (mustHaveUpdatePermission && document.owner !== userID) {
        return false;
    }

    return true;
}

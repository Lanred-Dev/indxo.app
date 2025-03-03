import { ObjectId } from "mongodb";
import type { Set } from "$lib/database/documents/Set.ts";
import type { Folder } from "$lib/database/documents/Folder.ts";

/**
 * Checks if the user has permission to view/update the document.
 *
 * @param document The document to check.
 * @param userID The ID of the user to check.
 * @param mustHaveEditPermission Also check if the user has permission to edit/update the document.
 * @returns If the user has permission to view the document, or edit a document.
 */
export default function permissionCheck(
    document: Set | Folder | null,
    userID: ObjectId | string,
    mustHaveEditPermission?: boolean
): boolean {
    if (!document) {
        return false;
    }

    const ownerID: string =
        typeof document.owner === "string"
            ? document.owner
            : "_id" in document.owner
              ? (document.owner._id as string)
              : document.owner.toString();
    const isOwner: boolean = ownerID === (typeof userID === "string" ? userID : userID.toString());

    if (!document.isPublic && !isOwner) {
        return false;
    }

    if (mustHaveEditPermission) {
        if (!isOwner) {
            return false;
        }
    }

    return true;
}

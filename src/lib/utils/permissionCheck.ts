import { ObjectId } from "mongodb";
import type { PublicSet, Set } from "$lib/database/documents/Set.ts";
import type { Folder, PublicFolder } from "$lib/database/documents/Folder.ts";

/**
 * Checks if the user has permission to view/update the document.
 *
 * @param document The document to check.
 * @param userID The ID of the user to check.
 * @param mustHaveEditPermission Also check if the user has permission to edit/update the document.
 * @returns If the user has permission to view the document, or edit a document.
 */
export default function permissionCheck(
    document: Set | PublicSet | Folder | PublicFolder | null,
    userID: ObjectId | string,
    mustHaveEditPermission?: boolean
): boolean {
    if (!document) {
        return false;
    }

    const ownerID: string = (
        "_id" in document.owner ? document.owner._id : document.owner
    ).toString();
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

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
    userID: string,
    mustHaveEditPermission?: boolean
): boolean {
    if (!document) return false;

    const ownerID: string =
        typeof document.owner === "object" && "_id" in document.owner
            ? document.owner._id
            : document.owner;
    const isOwner: boolean = ownerID === userID;

    if ((!document.isPublic && !isOwner) || (mustHaveEditPermission && !isOwner)) return false;

    return true;
}

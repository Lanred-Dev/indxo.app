import { DocumentPermission } from "$lib/documents";

/**
 * Determines if a permission is equal to (or greater than) another.
 *
 * @param permission1
 * @param permission2
 * @returns true/false
 */
export default function isPermissionEqual(
    permission1: DocumentPermission,
    permission2: DocumentPermission
): boolean {
    return permission1 >= permission2;
}

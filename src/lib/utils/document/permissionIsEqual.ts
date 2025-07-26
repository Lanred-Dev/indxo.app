import { DocumentPermission } from "$lib/documents";

/**
 * Determines if a permission is equal to another (edit = owner).
 *
 * @param permission1
 * @param permission2
 * @returns If the permissions have the same authority
 */
export default function permissionIsEqual(
    permission1: DocumentPermission,
    permission2: DocumentPermission
): boolean {
    return permission1 >= permission2;
}

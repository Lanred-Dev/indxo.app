import type { PublicSet } from "$lib/database/documents/Set";
import permissionCheck from "$lib/utils/permissionCheck.js";

export async function load({ fetch, params }) {
    const response = await fetch(`/api/documents/set/${params.id}`);

    if (response.status === 403) {
        return {
            permission: false,
        };
    }

    const userID: string = await (await fetch("/api/account")).json();
    const set: PublicSet = await response.json();

    return {
        set,
        permission: true,
        hasEditPermission: permissionCheck(set as any, userID, true),
    };
}

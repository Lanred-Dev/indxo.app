import type { PublicSet, Set } from "$lib/database/documents/Set";
import permissionCheck from "$lib/utils/permissionCheck.js";
import type { ObjectId } from "mongodb";

export async function load({ fetch, params }) {
    const response = await fetch(`/api/documents/set/${params.id}`);

    if (response.status === 403) {
        return {
            permission: false,
        };
    }

    const set: PublicSet = await response.json();
    const userID: string = await (await fetch("/api/account")).json();
    const isFavorite: boolean = await (
        await fetch(`/api/documents/${params.id}/is-favorite`)
    ).json();

    return {
        set,
        didFavorite: isFavorite,
        permission: true,
        hasEditPermission: permissionCheck(set, userID, true),
    };
}

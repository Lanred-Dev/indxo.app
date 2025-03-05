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

    const userID: string = await (await fetch("/api/account")).json();
    const userFavorites: ObjectId[] = await (
        await fetch(`/api/account/${userID}/favorites`)
    ).json();
    const set: PublicSet = await response.json();

    return {
        set,
        didFavorite: userFavorites.includes(set._id),
        permission: true,
        hasEditPermission: permissionCheck(set as unknown as Set, userID, true),
    };
}

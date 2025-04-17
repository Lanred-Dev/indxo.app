import type { PublicFolder } from "$lib/database/documents/Folder";
import type { PublicSet } from "$lib/database/documents/Set";
import type { User } from "$lib/database/documents/User";
import idToDocument from "$lib/utils/idToDocument";
import { error, json } from "@sveltejs/kit";

export async function GET({ params, fetch }) {
    const user: User | null = await idToDocument("users", params.id);

    if (!user) error(404, "User not found.");

    const favorites: (PublicSet | PublicFolder)[] = [];

    for (const [id, type] of user.favorites) {
        const response = await fetch(`/api/documents/${type}/${id}`);

        if (response.status !== 200) continue;

        const document: PublicSet | PublicFolder = await response.json();
        favorites.push(document);
    }

    return json(favorites);
}

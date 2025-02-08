import { ObjectId, type Collection } from "mongodb";
import { loadCollection } from "$lib/database/mongo";
import type { User } from "$lib/database/documents/User.ts";
import type { Set } from "$lib/database/documents/Set.ts";
import type { Folder } from "$lib/database/documents/Folder.ts";
import { json } from "@sveltejs/kit";

const users: Collection<User> = loadCollection("accounts", "users");
const sets: Collection<Set> = loadCollection("documents", "sets");
const folders: Collection<Folder> = loadCollection("documents", "folders");

/**
 * Checks if the user has permission to update the document.
 *
 * NOTE: This is used for things such as updating and deleting documents.
 *
 * @param userID The ID of the user.
 * @param response The response from the server.
 * @returns The response if the user does not have permission, otherwise null.
 */
export default async function permissionCheck(
    userID: ObjectId,
    response: Response
): Promise<Response | null> {
    if (response.status !== 200) {
        return json(
            {
                error: "Could not find document.",
            },
            { status: 404 }
        );
    }

    const document: Set | Folder = await response.json();

    // Since the request is coming over the web the owner is a string.
    if ((document.owner as unknown as string) !== userID.toString()) {
        return json(
            {
                error: "You do not have permission to update this document.",
            },
            { status: 403 }
        );
    }

    return null;
}

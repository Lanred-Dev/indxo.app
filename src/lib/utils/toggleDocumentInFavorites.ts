import type { Set } from "$lib/database/documents/Set";
import type { Folder } from "$lib/database/documents/Folder";
import permissionCheck from "$lib/utils/permissionCheck";
import type { User } from "$lib/database/documents/User";
import { Collection, ObjectId } from "mongodb";
import { loadCollection } from "$lib/database/mongo";

const users: Collection<User> = loadCollection("accounts", "users");
const sets: Collection<Set> = loadCollection("documents", "sets");
const folders: Collection<Folder> = loadCollection("documents", "folders");

/**
 * Adds a document to the user's favorites or removes it if it is already in the favorites.
 *
 * @param documentType The type of the document to add to favorites. Can be "sets" or "folders".
 * @param documentID The ID of the document to add to favorites. NOTE: This will be converted to an ObjectId if it is a string.
 * @param userID The ID of the user to add the document to favorites. NOTE: This will be converted to an ObjectId if it is a string.
 * @returns True if the document was added/removed to favorites. False if the user does not have permission to edit the document. The second value is if the document is now in the favorites.
 */
export default async function toggleDocumentInFavorites(
    documentType: "set" | "folder",
    documentID: ObjectId | string,
    userID: ObjectId | string
): Promise<[boolean, boolean]> {
    documentID = typeof documentID === "string" ? new ObjectId(documentID) : documentID;
    userID = typeof userID === "string" ? new ObjectId(userID) : userID;

    const document: Set | Folder | null = await (
        documentType === "folder" ? folders : sets
    ).findOne({
        _id: documentID,
    });

    if (!permissionCheck(document, userID)) {
        return [false, false];
    }

    const user: User | null = await users.findOne({ _id: userID });
    let wasInFavorites: boolean = false;
    let isFavorite: boolean = false;

    if (user) {
        user.favorites = user.favorites.filter((id) => {
            const matches: boolean = id.toString() === documentID.toString();

            if (matches) wasInFavorites = true;

            return !matches;
        });
    }

    if (!wasInFavorites) {
        isFavorite = true;
        user?.favorites.push([documentID, documentType]);
    }

    await users.updateOne(
        {
            _id: userID,
        },
        {
            $set: {
                favorites: user?.favorites,
            },
        }
    );

    return [true, isFavorite];
}

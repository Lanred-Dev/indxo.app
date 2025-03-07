import { json } from "@sveltejs/kit";
import { loadCollection } from "$lib/database/mongo";
import { type Collection } from "mongodb";
import type { Set } from "$lib/database/documents/Set";
import type { User } from "$lib/database/documents/User";
import type { Folder } from "$lib/database/documents/Folder";
import determineDocumentType from "$lib/utils/determineDocumentType";

const users: Collection<User> = loadCollection("accounts", "users");
const sets: Collection<Set> = loadCollection("documents", "sets");
const folders: Collection<Folder> = loadCollection("documents", "folders");

export type returnOnly = "user" | "set" | "folder";

export async function POST({ request }) {
    const {
        query,
        returnOnly,
        maxResults = 5,
    }: {
        query: string;
        returnOnly?: returnOnly;
        maxResults?: number;
    } = await request.json();

    const searchQuery = {
        $regex: query,
        $options: "i",
    };

    const usersResults: User[] = await users
        .find({
            name: searchQuery,
        })
        .limit(maxResults)
        .toArray();

    const setsResults: Set[] = await sets
        .find({
            isPublic: true,
            $or: [
                {
                    name: searchQuery,
                },
                {
                    subject: searchQuery,
                },
                {
                    description: searchQuery,
                },
            ],
        })
        .limit(maxResults)
        .toArray();

    const foldersResults: Folder[] = await folders
        .find({
            isPublic: true,
            name: searchQuery,
            description: searchQuery,
        })
        .limit(maxResults)
        .toArray();

    let results = [];

    switch (returnOnly) {
        case "user":
            results = usersResults;
            break;
        case "set":
            results = setsResults;
            break;
        case "folder":
            results = foldersResults;
            break;
        default:
            results = [...usersResults, ...setsResults, ...foldersResults];
    }

    const bestResults =
        results.length > 1
            ? results
                  .sort((result1, result2) => {
                      const result1Score: number =
                          result1.name.match(query)?.length +
                          result1.description?.match(query)?.length +
                          result1.subject?.match(query)?.length;
                      const result2Score: number =
                          result2.name.match(query)?.length +
                          result2.description?.match(query)?.length +
                          result2.subject?.match(query)?.length;

                      return result2Score - result1Score;
                  })
                  .splice(maxResults)
            : results;

    // Go through the results and remove the fields that are not needed return only the _id, name, image and description (and subject for sets)
    for (const result of bestResults) {
        const type = determineDocumentType(result);

        switch (type) {
            case "account":
                delete result.email;
                delete result.banned;
                delete result.sets;
                delete result.folders;
                delete result.favorites;
                delete result.homeSectionPreferences;
                delete result.openedSets;
                break;
            case "set":
                delete result.isPublic;
                delete result.terms;
                delete result.owner;
                break;
            case "folder":
                delete result.isPublic;
                break;
        }

        delete result.created;
    }

    return json(bestResults);
}

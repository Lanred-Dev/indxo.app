import { json } from "@sveltejs/kit";
import { loadCollection } from "$lib/database/mongo";
import { type Collection } from "mongodb";
import type { Set, SimpleSet } from "$lib/database/documents/Set";
import type { SimpleUser, User } from "$lib/database/documents/User";
import type { Folder, SimpleFolder } from "$lib/database/documents/Folder";
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

    let results: (User | Set | Folder)[] = [];

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

    let bestResults =
        results.length > 1
            ? results.sort((result1, result2) => {
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
            : results;

    bestResults.splice(maxResults);

    return json(
        bestResults.map((result) => {
            switch (determineDocumentType(result)) {
                case "user":
                    return {
                        _id: result._id,
                        name: result.name,
                        image: result.image,
                    };
                case "set":
                    return {
                        _id: result._id,
                        name: result.name,
                        description: result.description,
                        subject: result.subject,
                    };
                case "folder":
                    return {
                        _id: result._id,
                        name: result.name,
                        icon: result.icon,
                        description: result.description,
                    };
            }
        }) as (SimpleUser | SimpleSet | SimpleFolder)[]
    );
}

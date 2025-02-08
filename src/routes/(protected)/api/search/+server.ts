import { json } from "@sveltejs/kit";
import { loadCollection } from "$lib/database/mongo";
import { ObjectId, type Collection } from "mongodb";
import type { Set } from "$lib/database/documents/Set";
import type { User } from "$lib/database/documents/User";
import type { Folder } from "$lib/database/documents/Folder";

const users: Collection<User> = loadCollection("accounts", "users");
const sets: Collection<Set> = loadCollection("documents", "sets");
const folders: Collection<Folder> = loadCollection("documents", "folders");

export async function POST({ request, locals }) {
    const {
        query,
        returnOnly,
        maxResults = 5,
    }: {
        query: string;
        returnOnly?: "user" | "set" | "folder";
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
        .limit(5)
        .toArray();

    const setsResults: Set[] = await sets
        .find({
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
        .limit(5)
        .toArray();

    const foldersResults: Folder[] = await folders
        .find({
            name: searchQuery,
            description: searchQuery,
        })
        .limit(5)
        .toArray();

    let results = [];

    if (typeof returnOnly === "string") {
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
        }
    } else {
        results = [...usersResults, ...setsResults, ...foldersResults];
    }

    const bestResults = results
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
        .splice(maxResults);

    return json(bestResults);
}

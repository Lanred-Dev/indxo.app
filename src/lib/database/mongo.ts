import { MONGO_URI } from "$env/static/private";
import { MongoClient, type Collection, type Db, type Document } from "mongodb";

if (!MONGO_URI) {
    throw new Error("`MONGO_URI` is not defined in the environment variables");
}

let client = new MongoClient(MONGO_URI);
const databases: { [key: string]: Db } = {};

/**
 * Load a collection from the database.
 *
 * @param database The name of the database to load the collection from.
 * @param collection The name of the collection to load.
 * @returns The collection.
 */
export function loadCollection<T extends Document>(
    database: string,
    collection: string
): Collection<T> {
    if (!databases[database]) {
        databases[database] = client.db(database);

        // Confirm that the database connected.
        databases[database].command({ ping: 1 });
    }

    return databases[database].collection(collection);
}

export default client;

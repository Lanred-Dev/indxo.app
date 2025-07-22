import { Collection, MongoClient, type Db } from "mongodb";

const databases: { [key: string]: Db } = {};
const collections: { [key: string]: Collection<any> } = {};

/**
 * Loads a collection from the database.
 *
 * @param database
 * @param collection
 * @returns The collection
 */
export function loadCollection(database: string, collection: string): Collection<any> {
    if (!databases[database]) {
        databases[database] = client.db(database);
        databases[database].command({ ping: 1 }); // Confirm that we connected to the database.
    }

    if (!collections[collection]) {
        collections[collection] = databases[database].collection(collection);
        return collections[collection];
    } else {
        return collections[collection];
    }
}

export const client: MongoClient = new MongoClient(process.env.MONGO_URI!);

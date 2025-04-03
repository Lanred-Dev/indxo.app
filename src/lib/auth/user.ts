import { fields, type User } from "$lib/database/documents/User";
import type { Collection } from "mongodb";
import { loadCollection } from "$lib/database/mongo";

const users: Collection<User> = loadCollection("accounts", "users");

/**
 * Compares the current user's fields to the fields array and updates the user with any missing fields.
 *
 * @param id The ID of the user to update.
 * @returns
 */
export async function checkUserForUpdates(id: string) {
    const user: User | null = await users.findOne({ _id: id });

    if (!user) return;

    const missingFields = fields.filter(([key, type]) => {
        if (!(key in user)) return true;

        const value: any = user[key];

        switch (type) {
            case "array":
                return !Array.isArray(value);
            case "dictionary":
                return !(typeof value === "object" && !Array.isArray(value));
            case "string":
                return typeof value !== "string";
            case "boolean":
                return typeof value !== "boolean";
        }
    });

    await users.updateOne(
        {
            _id: id,
        },
        {
            $set: {
                ...Object.fromEntries(
                    missingFields.map(([key, type]) => {
                        let value: any;

                        switch (type) {
                            case "array":
                                value = [];
                                break;
                            case "dictionary":
                                value = {};
                                break;
                            case "string":
                                value = "";
                                break;
                            case "boolean":
                                value = "";
                                break;
                        }

                        return [key, value];
                    })
                ),
            },
        }
    );

    return user;
}

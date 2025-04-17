import { fields, type User } from "$lib/database/documents/User";
import { loadCollection } from "$lib/database/mongo";
import type { Collection } from "mongodb";

const users: Collection<User> = loadCollection("accounts", "users");

/**
 * Compares the current user's fields to the fields array and updates the user with any missing fields.
 *
 * @param user The user to check
 * @returns never
 */
export async function checkUserForUpdates(user: User) {
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

    if (missingFields.length === 0) return;

    await users.updateOne(
        {
            _id: user._id,
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
}

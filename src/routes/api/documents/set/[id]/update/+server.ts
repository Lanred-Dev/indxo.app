import { error } from "@sveltejs/kit";
import { loadCollection } from "$lib/database/mongo";
import { type Collection } from "mongodb";
import { updatableFields, type Set } from "$lib/database/documents/Set";
import permissionCheck from "$lib/utils/permissionCheck";
import generateRandomID from "$lib/utils/generateRandomID";

const sets: Collection<Set> = loadCollection("documents", "sets");

export async function POST({ params, request, fetch, locals }) {
    if (!locals.session) error(401, "Unauthorized.");

    const set: Set = await (await fetch(`/api/documents/set/${params.id}`)).json();

    if (!permissionCheck(set, locals.user._id, true))
        error(403, "You do not have permission to update this set.");

    const newFields: { [key: string]: any } = await request.json();
    const validFields: { [key: string]: any } = {};

    // Check if the new fields are valid
    for (const key in newFields) {
        if (
            !(key in updatableFields) || Array.isArray(newFields[key])
                ? updatableFields[key] !== "array"
                : updatableFields[key] !== typeof newFields[key]
        )
            continue;

        validFields[key] = newFields[key];
    }

    if ("terms" in validFields) {
        for (const term of validFields.terms) {
            if (!term._id) continue;

            term._id = generateRandomID(5);
        }
    }

    await sets.updateOne(
        {
            _id: params.id,
        },
        {
            $set: validFields,
        }
    );

    return new Response(null, {
        status: 204,
    });
}

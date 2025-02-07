import { json } from "@sveltejs/kit";
import { loadCollection } from "$lib/database/mongo";
import { ObjectId, type Collection } from "mongodb";
import { updatableFields, type Set } from "$lib/database/documents/Set";
import permissionCheck from "$lib/utils/permissionCheck.js";

const sets: Collection<Set> = loadCollection("documents", "sets");

export async function POST({ params, request, fetch, locals }) {
    const response = await fetch(`/api/documents/set/${params.id}`);
    const hasPermission = await permissionCheck(locals.userID, response);

    if (hasPermission) {
        return hasPermission;
    }

    const newFields: { [key: string]: any } = await request.json();
    const validFields: { [key: string]: any } = {};
    const id: ObjectId = new ObjectId(params.id);

    for (const key in newFields) {
        if (
            !(key in updatableFields) || Array.isArray(newFields[key])
                ? updatableFields[key] !== "array"
                : updatableFields[key] !== typeof newFields[key]
        )
            continue;

        validFields[key] = newFields[key];
    }

    await sets.updateOne(
        {
            _id: id,
        },
        {
            $set: validFields,
        }
    );

    return json({
        success: true,
    });
}

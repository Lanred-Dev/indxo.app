import { error } from "@sveltejs/kit";
import { loadCollection } from "$lib/database/mongo";
import { type Collection } from "mongodb";
import { updatableFields, type Folder } from "$lib/database/documents/Folder";
import permissionCheck from "$lib/utils/permissionCheck";

const folders: Collection<Folder> = loadCollection("documents", "folders");

export async function POST({ params, request, locals }) {
    if (!locals.session) error(401, "Unauthorized.");

    const folder: Folder | null = await folders.findOne({
        _id: params.id,
    });

    if (!folder || !permissionCheck(folder, locals.user._id, true))
        error(403, "You do not have permission to update this folder.");

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

    await folders.updateOne(
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

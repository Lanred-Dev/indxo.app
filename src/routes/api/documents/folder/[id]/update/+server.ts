import { updatableFields, type Folder } from "$lib/database/documents/Folder";
import type { Set } from "$lib/database/documents/Set";
import { loadCollection } from "$lib/database/mongo";
import permissionCheck from "$lib/utils/permissionCheck";
import { error } from "@sveltejs/kit";
import { type Collection } from "mongodb";

const folders: Collection<Folder> = loadCollection("documents", "folders");
const sets: Collection<Set> = loadCollection("documents", "sets");

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

    if (validFields.length === 0)
        return new Response(null, {
            status: 204,
        });

    if ("sets" in validFields) {
        await sets.updateMany(
            {
                _id: { $in: validFields.sets },
            },
            {
                // For some reason a type error is thrown here, but it works fine
                // @ts-ignore
                $push: {
                    folder: params.id,
                },
            }
        );
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

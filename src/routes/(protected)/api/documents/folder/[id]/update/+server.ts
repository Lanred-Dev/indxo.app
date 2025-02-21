import { json } from "@sveltejs/kit";
import { loadCollection } from "$lib/database/mongo";
import { ObjectId, type Collection } from "mongodb";
import { updatableFields, type Folder } from "$lib/database/documents/Folder";
import permissionCheck from "$lib/utils/permissionCheck";

const folders: Collection<Folder> = loadCollection("documents", "folders");

export async function POST({ params, request, fetch, locals }) {
    const folder: Folder = await (await fetch(`/api/documents/folder/${params.id}`)).json();

    if (!permissionCheck(folder, locals.userID, true)) {
        return json({ success: false }, { status: 403 });
    }

    const newFields: { [key: string]: any } = await request.json();
    const validFields: { [key: string]: any } = {};
    const id: ObjectId = new ObjectId(params.id);

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

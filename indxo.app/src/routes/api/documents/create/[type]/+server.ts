import {
    DocumentPermission,
    DocumentType,
    folderFields,
    setFields,
    type Folder,
    type Set,
    type User,
} from "$lib/documents";
import { loadCollection } from "$lib/server/mongo.js";
import { ResponseCodes, ResponseMessages } from "$lib/utils/apiResponses.js";
import { resolveMissingDocumentFields, validateFieldType } from "$lib/utils/document/fields.js";
import generateDocumentID from "$lib/utils/document/generateID.js";
import { error, json } from "@sveltejs/kit";
import type { Collection } from "mongodb";

const users: Collection<User> = loadCollection("accounts", "users");
const sets: Collection<Set> = loadCollection("documents", "sets");
const folders: Collection<Folder> = loadCollection("documents", "folders");

export async function POST({ params, locals, request }) {
    if (!locals.session) error(ResponseCodes.Unauthorized, ResponseMessages.Unauthorized);

    if (params.type !== DocumentType.folder && params.type !== DocumentType.set)
        error(ResponseCodes.BadRequest, ResponseMessages.InvalidDocumentType);

    const validFields: Record<string, unknown> = {};
    let documentFields = params.type === DocumentType.folder ? folderFields : setFields;

    for (const [id, value] of Object.entries(await request.json())) {
        const field = documentFields[id];

        if (!field || !field.properties.isUserUpdateable) continue;

        const isValid = validateFieldType(value, field.type);

        if (!isValid)
            error(ResponseCodes.BadRequest, `Invalid value for field '${id}' (value: ${value}).`);

        validFields[id] = value;
    }

    const documentID: string = generateDocumentID(15, params.type);
    const [actualFields] = resolveMissingDocumentFields(
        {
            _id: documentID,
            owner: locals.user._id,
            created: Date.now(),
            permissions: {
                [locals.user._id]: DocumentPermission.owner,
            },
            ...validFields,
        },
        documentFields
    );

    await (params.type === DocumentType.folder ? folders : sets).insertOne(actualFields as any);

    await users.updateOne(
        { _id: locals.user._id },
        {
            // For some reason a type error is thrown here, but it works fine
            // @ts-ignore
            $push: {
                [params.type === DocumentType.folder ? "folders" : "sets"]: documentID,
            },
        }
    );

    return json(documentID);
}

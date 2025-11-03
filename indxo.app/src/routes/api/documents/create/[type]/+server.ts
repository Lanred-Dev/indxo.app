import {
    DocumentPermission,
    DocumentType,
    folderFields,
    setFields,
    type DocumentFields,
    type Folder,
    type Set,
    type User,
} from "$lib/documents";
import { loadCollection } from "$lib/server/mongo.js";
import getValidFields from "$lib/server/utils/document/getValidFields.js";
import { ResponseCodes, ResponseMessages } from "$lib/utils/apiResponses.js";
import { resolveMissingDocumentFields } from "$lib/utils/document/fields.js";
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

    const documentFields: DocumentFields =
        params.type === DocumentType.folder ? folderFields : setFields;
    const validFields = getValidFields(await request.json(), documentFields);

    if (validFields instanceof Response) return validFields;

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

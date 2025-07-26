import {
    DocumentPermission,
    DocumentType,
    folderFields,
    setFields,
    termFields,
    type BaseUser,
    type Folder,
    type PublicFolder,
    type PublicSet,
    type Set,
    type Term,
    type User,
} from "$lib/documents";
import { loadCollection } from "$lib/server/mongo";
import { findDocumentByID } from "$lib/server/utils/document/findByID";
import { ResponseCodes, ResponseMessages } from "$lib/utils/apiResponses";
import determineDocumentType from "$lib/utils/document/determineType";
import { determineIfDocumentContainsFields, validateFieldType } from "$lib/utils/document/fields";
import { error, json } from "@sveltejs/kit";
import type { Collection } from "mongodb";

const users: Collection<User> = loadCollection("accounts", "users");
const sets: Collection<Set> = loadCollection("documents", "sets");
const folders: Collection<Folder> = loadCollection("documents", "folders");

export async function GET({ params, fetch, locals }) {
    const hasPermissionFetch = await fetch(
        `/api/documents/${params.id}/permissions/${locals.user._id}`,
        {
            method: "POST",
            body: JSON.stringify(DocumentPermission.view),
        }
    );

    if (hasPermissionFetch.status !== ResponseCodes.Success)
        error(hasPermissionFetch.status, await hasPermissionFetch.json());

    const document: Set | Folder = await findDocumentByID(params.id);
    const owner: BaseUser = await (await fetch(`/api/user/${document.owner}/base`)).json();
    const documentType = determineDocumentType(params.id);

    if (documentType === DocumentType.folder) {
        const { name, icon, description, created, _id, sets } = document as Folder;
        const actualSets: PublicSet[] = [];

        for (const id of sets) {
            const setFetch = await fetch(`/api/documents/${id}`);

            if (setFetch.status !== ResponseCodes.Success) continue;

            actualSets.push((await setFetch.json()) as PublicSet);
        }

        return json({
            name,
            icon,
            description,
            created,
            _id,
            sets: actualSets,
            owner: owner,
        } satisfies PublicFolder);
    } else if (documentType === DocumentType.set) {
        const { name, terms, subject, description, created, _id, folders } = document as Set;
        return json({
            name,
            terms,
            subject,
            description,
            created,
            _id,
            folders,
            owner: owner,
        } satisfies PublicSet);
    }
}

export async function DELETE({ params, locals, fetch }) {
    if (!locals.session) error(ResponseCodes.Unauthorized, ResponseMessages.Unauthorized);

    const hasPermissionFetch: Response = await fetch(
        `/api/documents/${params.id}/permissions/${locals.user._id}`,
        {
            method: "POST",
            body: JSON.stringify(DocumentPermission.owner),
        }
    );

    if (hasPermissionFetch.status !== ResponseCodes.Success)
        error(hasPermissionFetch.status, await hasPermissionFetch.json());

    const documentType = determineDocumentType(params.id);

    // If its a folder update any sets that are linked to it
    if (documentType === DocumentType.folder)
        await sets.updateMany(
            { folders: { $in: [params.id] } },
            {
                // For some reason a type error is thrown here, but it works fine
                // @ts-ignore
                $pull: {
                    folder: params.id,
                },
            }
        );

    await users.updateOne(
        { _id: locals.user._id },
        {
            // For some reason a type error is thrown here, but it works fine
            // @ts-ignore
            $pull: {
                [documentType === DocumentType.folder ? "folders" : "sets"]: params.id,
            },
        }
    );

    await (documentType === DocumentType.folder ? folders : sets).deleteOne({
        _id: params.id,
    });

    return new Response(null, {
        status: ResponseCodes.SuccessNoResponse,
    });
}

export async function PUT({ params, locals, request, fetch }) {
    if (!locals.session) error(ResponseCodes.Unauthorized, ResponseMessages.Unauthorized);

    const hasPermissionFetch = await fetch(
        `/api/documents/${params.id}/permissions/${locals.user._id}`,
        {
            method: "POST",
            body: JSON.stringify(DocumentPermission.edit),
        }
    );

    if (hasPermissionFetch.status !== ResponseCodes.Success)
        error(hasPermissionFetch.status, await hasPermissionFetch.json());

    const documentType = determineDocumentType(params.id);
    const validFields: Record<string, unknown> = {};
    const documentFields = documentType === DocumentType.folder ? folderFields : setFields;

    for (const [id, value] of Object.entries(await request.json())) {
        const field = documentFields[id];

        if (!field || !field.properties.isUserUpdateable) continue;

        const isValid = validateFieldType(value, field.type);

        if (!isValid) error(ResponseCodes.BadRequest, `Invalid value for field ${id}.`);

        validFields[id] = value;
    }

    // No updates were made
    if (validFields.length === 0)
        return new Response(null, {
            status: ResponseCodes.SuccessNoResponse,
        });

    if (documentType === DocumentType.folder && "sets" in validFields) {
        const document: Folder = await findDocumentByID(params.id);
        const removedSets: string[] = document.sets.filter(
            (set) => !(validFields.sets as string[]).includes(set)
        );
        const addedSets: string[] = (validFields.sets as string[]).filter(
            (set) => !document.sets.includes(set)
        );

        if (removedSets.length > 0)
            await sets.updateMany(
                { _id: { $in: removedSets } },
                {
                    $pull: {
                        folders: params.id,
                    },
                }
            );

        if (addedSets.length > 0)
            await sets.updateMany(
                { _id: { $in: addedSets } },
                {
                    $push: {
                        folders: params.id,
                    },
                }
            );
    } else if (
        documentType === DocumentType.set &&
        "terms" in validFields &&
        Array.isArray(validFields.terms)
    ) {
        // Ensure that all terms are valid
        for (const term of validFields.terms as Term[]) {
            if (determineDocumentType(term._id) !== DocumentType.term)
                error(ResponseCodes.BadRequest, "Non-term document provided.");

            const isValid = determineIfDocumentContainsFields(term, termFields);

            if (!isValid) error(ResponseCodes.BadRequest, "Invalid term provided.");
        }
    }

    await (documentType === DocumentType.folder ? folders : sets).updateOne(
        {
            _id: params.id,
        },
        {
            $set: validFields,
        }
    );

    return new Response(null, {
        status: ResponseCodes.SuccessNoResponse,
    });
}

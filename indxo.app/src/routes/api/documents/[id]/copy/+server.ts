import { DocumentPermission, DocumentType } from "$lib/documents";
import { ResponseCodes, ResponseMessages } from "$lib/utils/apiResponses";
import determineDocumentType from "$lib/utils/document/determineType";
import { error, json } from "@sveltejs/kit";
import type { RequestEvent } from "../$types";

export async function POST({ fetch, params, locals }: RequestEvent) {
    if (!locals.session) error(ResponseCodes.Unauthorized, ResponseMessages.Unauthorized);

    const hasPermissionFetch = await fetch(
        `/api/documents/${params.id}/permissions/${locals.user._id}`,
        {
            method: "POST",
            body: JSON.stringify(DocumentPermission.view),
        }
    );

    if (hasPermissionFetch.status !== ResponseCodes.Success)
        error(hasPermissionFetch.status, await hasPermissionFetch.json());

    // Easier to cast type to any here since we don't need strict typing for copying
    const document: any = await (await fetch(`/api/documents/${params.id}`)).json();
    const type: DocumentType | null = determineDocumentType(params.id);

    switch (type) {
        case DocumentType.set:
        case DocumentType.folder: {
            document.copiedFrom = params.id;
            delete document._id;
            delete document.permissions;
            delete document.created;
            delete document.updated;
            delete document.owner;
            delete document.rating;

            const createResponse = await fetch(`/api/documents/create/${type}`, {
                method: "POST",
                body: JSON.stringify(document),
            });

            if (createResponse.status !== ResponseCodes.Success)
                error(createResponse.status, await createResponse.json());

            return json(await createResponse.json());
        }
        default:
            error(ResponseCodes.BadRequest, ResponseMessages.InvalidDocumentType);
    }
}

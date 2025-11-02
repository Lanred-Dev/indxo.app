import { DocumentPermission, DocumentType } from "$lib/documents";
import { ResponseCodes, ResponseMessages } from "$lib/utils/apiResponses";
import determineDocumentType from "$lib/utils/document/determineType.js";
import { error, json } from "@sveltejs/kit";

export async function POST({ params, locals, fetch }) {
    const hasPermissionFetch = await fetch(
        `/api/documents/${params.id}/permissions/${locals.session ? locals.user._id : "0"}`,
        {
            method: "POST",
            body: JSON.stringify(DocumentPermission.view),
        }
    );

    if (hasPermissionFetch.status !== ResponseCodes.Success)
        error(hasPermissionFetch.status, hasPermissionFetch.statusText);

    // Easier to cast type to any here since we don't need strict typing for copying
    const document: any = await (await fetch(`/api/documents/${params.id}`)).json();
    const type: DocumentType | null = determineDocumentType(params.id);

    switch (type) {
        case DocumentType.set:
        case DocumentType.folder: {
            delete document._id;
            delete document.permissions;
            delete document.created;
            delete document.updated;
            delete document.owner;

            const createResponse = await fetch(`/api/documents/create/${type}`, {
                method: "POST",
                body: JSON.stringify(document),
            });

            if (createResponse.status !== ResponseCodes.Success)
                error(createResponse.status, createResponse.statusText);

            return json(await createResponse.text());
        }
        default:
            error(ResponseCodes.BadRequest, ResponseMessages.InvalidDocumentType);
    }
}

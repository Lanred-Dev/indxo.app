import { DocumentPermission, DocumentType } from "$lib/documents";
import { ResponseCodes, ResponseMessages } from "$lib/utils/apiResponses";
import determineDocumentType from "$lib/utils/document/determineType";
import { fail } from "@sveltejs/kit";

export const actions = {
    copyDocument: async ({ fetch, params, locals }) => {
        if (!locals.session) fail(ResponseCodes.Unauthorized, ResponseMessages.Unauthorized);

        const hasPermissionFetch = await fetch(
            `/api/documents/${params.id}/permissions/${locals.user._id}`,
            {
                method: "POST",
                body: JSON.stringify(DocumentPermission.view),
            }
        );

        if (hasPermissionFetch.status !== ResponseCodes.Success)
            fail(hasPermissionFetch.status, hasPermissionFetch.statusText);

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
                    fail(createResponse.status, createResponse.statusText);

                return { id: await createResponse.text() };
            }
            default:
                fail(ResponseCodes.BadRequest, ResponseMessages.InvalidDocumentType);
        }
    },
};

import { DocumentPermission, DocumentType, type Folder, type Set } from "$lib/documents";
import { ResponseCodes, ResponseMessages } from "$lib/utils/apiResponses";
import { determineDocumentType, findDocumentByID } from "$lib/utils/document";
import { error, json } from "@sveltejs/kit";

export async function GET({ params, locals }) {
    if (!locals.session) error(ResponseCodes.Unauthorized, ResponseMessages.Unauthorized);

    const documentType = determineDocumentType(params.id);

    if (documentType !== DocumentType.folder && documentType !== DocumentType.set)
        error(400, "Invalid document type.");

    const document: Set | Folder | null = await findDocumentByID(params.id);

    if (!document) error(ResponseCodes.NotFound, ResponseMessages.NotFound);

    return json(document.permissions[params.user] ?? DocumentPermission.none);
}

export async function POST({ params, locals, request }) {
    if (!locals.session) error(ResponseCodes.Unauthorized, ResponseMessages.Unauthorized);

    const documentType = determineDocumentType(params.id);

    if (documentType !== DocumentType.folder && documentType !== DocumentType.set)
        error(400, "Invalid document type.");

    const document: Set | Folder | null = await findDocumentByID(params.id);

    if (!document) error(ResponseCodes.NotFound, ResponseMessages.NotFound);

    const userPermission: DocumentPermission =
        document.permissions[params.user] ?? DocumentPermission.none;
    const requiredPermission: DocumentPermission = await request.json();

    if (userPermission === DocumentPermission.none)
        error(ResponseCodes.UserUnauthorized, `User does not have ${requiredPermission}.`);

    const userIsOwner = userPermission === DocumentPermission.owner;
    const userIsEditor = userPermission === DocumentPermission.edit;
    const userIsViewer = userPermission === DocumentPermission.view;
    let hasPermission: boolean = false;

    switch (requiredPermission) {
        case DocumentPermission.owner:
            hasPermission = userIsOwner;
            break;
        case DocumentPermission.edit:
            hasPermission = userIsOwner || userIsEditor;
            break;
        case DocumentPermission.view:
            hasPermission = userIsOwner || userIsEditor || userIsViewer;
            break;
    }

    if (!hasPermission) {
        error(ResponseCodes.UserUnauthorized, `User does not have ${requiredPermission}.`);
    } else {
        return new Response(null, {
            status: ResponseCodes.SuccessNoResponse,
        });
    }
}

import { DocumentPermission, DocumentType, type Folder, type Set } from "$lib/documents";
import { findDocumentByID } from "$lib/server/utils/document/findByID";
import { ResponseCodes, ResponseMessages } from "$lib/utils/apiResponses";
import determineDocumentType from "$lib/utils/document/determineType";
import permissionIsEqual from "$lib/utils/document/permissionIsEqual";
import { error, json } from "@sveltejs/kit";

export async function GET({ params, locals }) {
    if (!locals.session) error(ResponseCodes.Unauthorized, ResponseMessages.Unauthorized);

    const documentType = determineDocumentType(params.id);

    if (documentType !== DocumentType.folder && documentType !== DocumentType.set)
        error(ResponseCodes.BadRequest, ResponseMessages.InvalidDocumentType);

    const document: Set | Folder | null = await findDocumentByID(params.id);

    if (!document) error(ResponseCodes.NotFound, ResponseMessages.NotFound);

    return json(document.permissions[params.user] ?? DocumentPermission.none);
}

export async function POST({ params, locals, request }) {
    if (!locals.session) error(ResponseCodes.Unauthorized, ResponseMessages.Unauthorized);

    const documentType = determineDocumentType(params.id);

    if (documentType !== DocumentType.folder && documentType !== DocumentType.set)
        error(ResponseCodes.BadRequest, ResponseMessages.InvalidDocumentType);

    const document: Set | Folder | null = await findDocumentByID(params.id);

    if (!document) error(ResponseCodes.NotFound, ResponseMessages.NotFound);

    const userPermission: DocumentPermission =
        params.user in document.permissions
            ? document.permissions[params.user]
            : DocumentPermission.none;
    const requiredPermission: DocumentPermission = await request.json();

    if (!permissionIsEqual(userPermission, requiredPermission)) {
        error(ResponseCodes.UserUnauthorized, `User does not have ${requiredPermission}.`);
    } else {
        return json(document.permissions[params.user] ?? DocumentPermission.none);
    }
}

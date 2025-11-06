import {
    DocumentPermission,
    DocumentType,
    DocumentVisibilityPermissionMap,
    type Folder,
    type Set,
} from "$lib/documents";
import { findDocumentByID } from "$lib/server/utils/document/findByID";
import { ResponseCodes, ResponseMessages } from "$lib/utils/apiResponses";
import determineDocumentType from "$lib/utils/document/determineType";
import isPermissionEqual from "$lib/utils/document/isPermissionEqual";
import { error, json } from "@sveltejs/kit";

export async function GET({ params, locals }) {
    if (!locals.session) json(DocumentPermission.none);

    const documentType = determineDocumentType(params.id);

    if (documentType !== DocumentType.folder && documentType !== DocumentType.set)
        error(ResponseCodes.BadRequest, ResponseMessages.InvalidDocumentType);

    const document: Set | Folder | null = await findDocumentByID(params.id);

    if (!document) error(ResponseCodes.NotFound, ResponseMessages.NotFound);

    return json(
        params.user in document.permissions
            ? document.permissions[params.user]
            : DocumentPermission.none
    );
}

export async function POST({ params, locals, request }) {
    const documentType = determineDocumentType(params.id);

    if (documentType !== DocumentType.folder && documentType !== DocumentType.set)
        error(ResponseCodes.BadRequest, ResponseMessages.InvalidDocumentType);

    const document: Set | Folder | null = await findDocumentByID(params.id);

    if (!document) error(ResponseCodes.NotFound, ResponseMessages.NotFound);

    const userPermission: DocumentPermission =
        params.user in document.permissions
            ? document.permissions[params.user]
            : DocumentPermission.none;
    let requiredPermission: DocumentPermission;

    if (request.body) {
        requiredPermission = await request.json();
    } else {
        requiredPermission = DocumentVisibilityPermissionMap[document.visibility];
    }

    if (!isPermissionEqual(userPermission, requiredPermission)) {
        error(
            locals.session ? ResponseCodes.UserUnauthorized : ResponseCodes.Unauthorized,
            `User does not have ${requiredPermission}.`
        );
    } else {
        return json(document.permissions[params.user] ?? DocumentPermission.none);
    }
}

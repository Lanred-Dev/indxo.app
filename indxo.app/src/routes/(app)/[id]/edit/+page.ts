import {
    DocumentPermission,
    DocumentType,
    type PublicFolder,
    type PublicSet,
    type PublicUser,
} from "$lib/documents";
import { ResponseCodes, ResponseMessages } from "$lib/utils/apiResponses";
import { error, redirect } from "@sveltejs/kit";

export async function load({ params, fetch, parent }) {
    const { documentType, user } = await parent();
    const documentResponse: Response = await fetch(
        `/api/${documentType === DocumentType.user ? "user" : "documents"}/${params.id}`
    );
    const document: PublicFolder | PublicSet | PublicUser = await documentResponse.json();

    if (documentResponse.status !== ResponseCodes.Success)
        error(
            documentResponse.status,
            (document as { message?: string }).message ?? documentResponse.statusText
        );

    if (documentType === DocumentType.user) redirect(ResponseCodes.Redirect, `/${document._id}`);

    const permissionResponse: Response = await fetch(
        `/api/documents/${document._id}/permissions/${user._id}`,
        {
            method: "POST",
            body: JSON.stringify(DocumentPermission.edit),
        }
    );

    if (permissionResponse.status !== ResponseCodes.Success)
        error(ResponseCodes.UserUnauthorized, ResponseMessages.UserUnauthorized);

    return {
        document,
        permission: await permissionResponse.json(),
    };
}

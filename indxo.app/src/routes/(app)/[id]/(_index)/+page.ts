import {
    DocumentPermission,
    DocumentType,
    type PublicFolder,
    type PublicSet,
    type PublicUser,
} from "$lib/documents";
import { ResponseCodes } from "$lib/utils/apiResponses";
import { error } from "@sveltejs/kit";

export async function load({ params, fetch, parent }) {
    const { documentType, user, session } = await parent();
    const documentResponse: Response = await fetch(
        `/api/${documentType === DocumentType.user ? "user" : "documents"}/${params.id}`
    );

    if (documentResponse.status !== ResponseCodes.Success)
        error(documentResponse.status, documentResponse.statusText);

    const document: PublicFolder | PublicSet | PublicUser = await documentResponse.json();
    let permission: DocumentPermission | undefined = undefined;
    let isFavorite: boolean = false;
    let isEmpty: boolean = false;

    if (documentType !== DocumentType.user) {
        switch (documentType) {
            case DocumentType.folder:
                isEmpty = (document as PublicFolder).sets.length === 0;
                break;
            case DocumentType.set:
                isEmpty = (document as PublicSet).terms.length === 0;
                break;
        }

        const permissionResponse: Response = await fetch(
            `/api/documents/${document._id}/permissions/${user._id}`
        );

        if (permissionResponse.status === ResponseCodes.Success)
            permission = await permissionResponse.json();

        if (session) {
            const favoriteResponse: Response = await fetch(
                `/api/documents/${document._id}/favorite`
            );

            if (favoriteResponse.status === ResponseCodes.Success)
                isFavorite = await favoriteResponse.json();
        } else {
            isFavorite = false;
        }
    }

    return {
        document,
        permission,
        isFavorite,
        isEmpty,
    };
}

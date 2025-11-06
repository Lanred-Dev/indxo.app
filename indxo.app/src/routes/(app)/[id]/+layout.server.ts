import { DocumentType } from "$lib/documents";
import { ResponseCodes, ResponseMessages } from "$lib/utils/apiResponses";
import determineDocumentType from "$lib/utils/document/determineType";
import { error } from "@sveltejs/kit";

export function load({ params }) {
    const documentType = determineDocumentType(params.id);

    if (
        documentType !== DocumentType.folder &&
        documentType !== DocumentType.set &&
        documentType !== DocumentType.user
    )
        error(ResponseCodes.NotFound, ResponseMessages.NotFound);

    return {
        documentType,
    };
}

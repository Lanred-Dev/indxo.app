import { DocumentType } from "$lib/documents";
import { ResponseCodes } from "$lib/utils/apiResponses";
import determineDocumentType from "$lib/utils/document/determineType";
import { redirect } from "@sveltejs/kit";

export function load({ params }) {
    const documentType = determineDocumentType(params.id);

    if (documentType !== DocumentType.set) redirect(ResponseCodes.Redirect, "/");
}

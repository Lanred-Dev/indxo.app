import { DocumentType } from "$lib/documents";

/**
 * Determines the type of a document.
 *
 * @param document
 * @returns The document type, or null if it couldnt be determined
 */
export function determineDocumentType(
    document: { _id: string; [key: string]: any } | string
): DocumentType | null {
    // NOTE: `id` will not always have the type of `DocumentType`
    const id = (typeof document === "string" ? document[0] : document._id[0]) as DocumentType;
    return Object.values(DocumentType).includes(id) ? id : null;
}

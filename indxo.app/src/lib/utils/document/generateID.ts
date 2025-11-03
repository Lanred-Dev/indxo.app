import type { DocumentType } from "$lib/documents";
import randomArrayEntry from "../randomArrayEntry";

const CHARACTERS: string = "abcdefghijklmnopqrstuvwxyz0123456789";

/**
 * Generates a random id consisting of uppercase letters and digits.
 *
 * @param length
 * @param documentType
 * @returns The generated id
 */
export default function generateDocumentID(length: number, documentType: DocumentType): string {
    let id: string = "";

    for (let index: number = 0; index < length - (documentType ? 1 : 0); index++)
        id += randomArrayEntry(CHARACTERS);

    return `${documentType}${id}`;
}

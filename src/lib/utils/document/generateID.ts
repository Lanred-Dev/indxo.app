import { DocumentType } from "$lib/documents";
import randomArrayEntry from "../randomArrayEntry";

const characters: string = "abcdefghijklmnopqrstuvwxyz0123456789";
let startingCharacters: string[]; // A prefix is used to determine the type, so this prevents documents from being mislabeled if no prefix is provided

/**
 * Generates a random id consisting of uppercase letters and digits.
 *
 * @param length
 * @param documentType
 * @returns The generated id
 */
export default function generateDocumentID(length: number, documentType?: string): string {
    // The DocumentType enum may not first be available on runtime
    if (!startingCharacters)
        startingCharacters = characters
            .split("")
            .filter(
                (character: string) =>
                    !Object.values(DocumentType).includes(character as DocumentType)
            );

    let id: string = "";

    for (let index: number = 0; index < length - (documentType ? 1 : 0); index++)
        id += randomArrayEntry(index === 0 ? startingCharacters : characters);

    return `${documentType ?? ""}${id}`;
}

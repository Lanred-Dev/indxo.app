import randomArrayEntry from "./randomArrayEntry";

const characters: string = "abcdefghijklmnopqrstuvwxyz0123456789";

/**
 * Generates a random id consisting of uppercase letters and digits.
 *
 * @param length
 * @returns The generated id
 */
export default function generateDocumentID(length: number): string {
    let id: string = "";

    for (let index: number = 0; index < length; index++) id += randomArrayEntry(characters);

    return id;
}

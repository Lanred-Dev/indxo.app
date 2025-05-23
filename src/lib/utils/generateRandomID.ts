const CHARACTERS: string = "abcdefghijklmnopqrstuvwxyz0123456789";

/**
 * Generates a random ID consisting of uppercase letters and digits.
 *
 * @param length The length of the random ID to generate. Default is 12 characters.
 * @returns The generated random ID as a string.
 */
export default function generateRandomID(length: number = 12, prefix: string = ""): string {
    let id: string = "";
    let bytes = new Uint8Array(length);
    crypto.getRandomValues(bytes);

    for (let i = 0; i < length; i++) {
        id += CHARACTERS[bytes[i] % CHARACTERS.length];
    }

    return `${prefix}${id}`;
}

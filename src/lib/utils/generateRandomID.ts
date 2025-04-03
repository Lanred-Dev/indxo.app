const CHARACTERS: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

/**
 * Generates a random ID consisting of uppercase letters and digits.
 *
 * @param length The length of the random ID to generate. Default is 12 characters.
 * @returns
 */
export default function generateRandomID(length: number = 12): string {
    let id: string = "";

    for (let index: number = 0; index < length; index++) {
        id += CHARACTERS.charAt((Math.random() * 36) | 0);
    }

    return id;
}

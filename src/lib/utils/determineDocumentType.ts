/**
 * Determines the type of document.
 *
 * @param document The document to determine the type of.
 * @returns Either "account", "folder", or "set".
 */
export default function determineDocumentType(document: {
    icon?: string;
    image?: string;
    subject?: string;
    [key: string]: any;
}): "account" | "folder" | "set" {
    if ("icon" in document) return "folder";
    if ("subject" in document) return "set";
    if ("image" in document) return "account";

    return "account";
}

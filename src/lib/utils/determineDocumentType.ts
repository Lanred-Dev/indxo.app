/**
 * Determines the type of document.
 *
 * @param document The document to determine the type of.
 * @returns Either "user", "folder", or "set".
 */
export default function determineDocumentType(document: {
    icon?: string;
    image?: string;
    subject?: string;
    [key: string]: any;
}): "user" | "folder" | "set" {
    if ("subject" in document && (document.subject ?? "").trim().length > 0) return "set";
    if ("image" in document && (document.image ?? "").trim().length > 0) return "user";
    if ("icon" in document && (document.icon ?? "").trim().length > 0) return "folder";

    return "set";
}

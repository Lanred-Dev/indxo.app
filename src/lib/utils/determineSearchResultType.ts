/**
 * Determines the type of result based on the parameters provided.
 *
 * @param result The result to determine the type of.
 * @returns The type of result.
 */
export default function determineSearchResultType({
    icon,
    image,
    subject,
}: {
    icon?: string;
    image?: string;
    subject?: string;
}): "account" | "folder" | "set" {
    if (icon) return "folder";
    if (subject) return "set";
    if (image) return "account";

    return "account";
}

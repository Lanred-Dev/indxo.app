export type DocumentField = {
    key: string;
    type: "string" | "number" | "boolean" | "array" | "dictionary";
    defaultValue: any;
};

interface UnknownDocument {
    [key: string | number]: any;
}

/**
 * Removes incorrect fields and adds missing fields to a document.
 *
 * @param document
 * @param fields The correct set of fields the document should have
 * @returns The corrected document and if any changes were made
 */
export function resolveMissingDocumentFields(
    document: UnknownDocument,
    fields: DocumentField[]
): [UnknownDocument, boolean] {
    const missing = fields.filter(({ key, type }) => {
        const value: unknown = document[key];

        if (!value) return true;

        switch (type) {
            case "array":
                return !Array.isArray(value);
            case "dictionary":
                return !(typeof value === "object" && !Array.isArray(value));
            default:
                return typeof value !== "boolean";
        }
    });

    if (missing.length === 0) return [document, false];

    return [
        {
            // Remove all keys not in the fields array
            ...Object.fromEntries(
                Object.entries(document).filter(([key]) =>
                    fields.find(({ key: field }) => key === field)
                )
            ),
            // Add all the missing keys
            ...Object.fromEntries(missing.map(({ key, defaultValue }) => [key, defaultValue])),
        },
        true,
    ];
}

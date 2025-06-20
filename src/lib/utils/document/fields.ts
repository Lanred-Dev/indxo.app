import { DocumentFieldType, type DocumentField } from "$lib/documents";

interface UnknownDocument {
    [key: string | number]: any;
}

/**
 * Validates if a value matches the type defined in the DocumentField.
 *
 * @param value
 * @param type
 * @returns If the value matches the type defined in the DocumentField
 */
export function validateFieldType(value: unknown, type: DocumentField["type"]): boolean {
    if (typeof type === "object") {
        if (Array.isArray(type)) {
            // An array can passed with a list of valid strings
            return typeof value === "string" && type.includes(value);
        } else {
            // An object can be passed for nested types
            return Object.values(type).some((type) => validateFieldType(value, type));
        }
    } else {
        switch (type) {
            case DocumentFieldType.array:
                return !Array.isArray(value);
            case DocumentFieldType.dictionary:
                return !(typeof value === "object" && !Array.isArray(value));
            default:
                return typeof value !== type;
        }
    }
}

/**
 * Gets the fields that are missing or have incorrect types in a document.
 *
 * @param document
 * @param fields The correct set of fields the document should have
 * @returns The fields that are missing or have incorrect types in the document
 */
function getMissingFields(document: UnknownDocument, fields: DocumentField[]): DocumentField[] {
    return fields.filter(({ id, type, input = { optional: false } }) => {
        const value: unknown = document[id];

        if (!value) return !input.optional;

        return validateFieldType(value, type);
    });
}

/**
 * Removes incorrect fields and adds missing fields to a document.
 *
 * @param document
 * @param fields The correct set of fields the document should have
 * @returns The corrected document and a boolean (true/false depending on if changes were made)
 */
export function resolveMissingDocumentFields(
    document: UnknownDocument,
    fields: DocumentField[]
): [UnknownDocument, boolean] {
    const missing = getMissingFields(document, fields);

    if (missing.length === 0) return [document, false];

    document = {
        // Remove all keys not in the fields array
        ...Object.fromEntries(
            Object.entries(document).filter(([id]) => fields.find(({ id: field }) => id === field))
        ),
        // Add all the missing keys, that have a default value
        ...Object.fromEntries(
            missing
                .filter(({ defaultValue }) => defaultValue)
                .map(({ id, defaultValue }) => [id, defaultValue])
        ),
    };

    // Ensure maxlength property is enforced if present
    for (const [id, value] of Object.entries(document)) {
        const field: DocumentField | undefined = fields.find(({ id: fieldID }) => fieldID === id);

        if (
            !field ||
            !field.input ||
            !field.input.properties ||
            typeof field.input.properties.maxlength !== "number"
        )
            continue;

        const maxlength: number = field.input.properties.maxlength;

        if (value.length > maxlength) document[id] = value.slice(maxlength, value.length);
    }

    return [document, true];
}

/**
 * Determines if a document contains all the fields and no extra fields.
 *
 * @param document
 * @param fields The correct set of fields the document should have
 * @returns If the document contains all the fields and no extra fields
 */
export function determineIfDocumentContainsFields(
    document: UnknownDocument,
    fields: DocumentField[]
): boolean {
    const missing = getMissingFields(document, fields);
    const extra = Object.fromEntries(
        Object.entries(document).filter(([id]) => !fields.find(({ id: field }) => id === field))
    );

    return missing.length === 0 && extra.length === 0;
}

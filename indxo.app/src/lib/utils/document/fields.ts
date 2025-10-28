import { DocumentFieldType, type DocumentField, type DocumentFields } from "$lib/documents";

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
            // An array can passed with a list of valid strings or numbers
            return (typeof value === "string" || typeof value === "number") && type.includes(value);
        } else {
            // An object can be passed for nested types
            return Object.values(type).some((type) => validateFieldType(value, type));
        }
    } else {
        switch (type) {
            case DocumentFieldType.array:
                return Array.isArray(value);
            case DocumentFieldType.dictionary:
                return typeof value === "object" && !Array.isArray(value);
            default:
                return typeof value === type;
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
function getMissingFields(
    document: UnknownDocument,
    fields: DocumentFields
): [string, DocumentField][] {
    return Object.entries(fields).filter(([id, { type, properties = { isRequired: false } }]) => {
        const value: unknown = document[id];

        if (value === undefined || value === null) return properties?.isRequired;

        return !validateFieldType(value, type);
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
    fields: DocumentFields
): [UnknownDocument, boolean] {
    const missingFields = getMissingFields(document, fields);

    if (missingFields.length === 0) return [document, false];

    document = {
        // Remove all keys not in the fields array
        ...Object.fromEntries(Object.entries(document).filter(([id]) => id in fields)),
        // Add all the missing keys, that have a default value
        ...Object.fromEntries(
            missingFields
                .filter(([_id, { properties }]) => properties?.defaultValue !== undefined)
                .map(([id, { properties }]) => [id, properties?.defaultValue])
        ),
    };

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
    fields: DocumentFields
): boolean {
    const missingFields = getMissingFields(document, fields);
    const extraFields = Object.entries(document).filter(([id]) => !(id in fields));
    return missingFields.length + extraFields.length === 0;
}

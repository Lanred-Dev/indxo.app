import { DocumentFieldType, type DocumentField, type DocumentFields } from "$lib/documents";
import { ResponseCodes } from "$lib/utils/apiResponses";

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
            if (typeof value !== "object" || Array.isArray(value) || value === null) return false;

            // An object can be passed for nested types
            return Object.entries(type).some(([key, type]) => {
                if (!(key in value)) return false;

                return validateFieldType((value as any)[key], type);
            });
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
        if (!(id in document)) return properties.isRequired === true;

        const value: unknown = document[id];

        if (value === undefined || value === null) return properties.isRequired === true;

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

/**
 * Get valid fields from the provided fields object or return a Response indicating an error or no updates.
 *
 * @param fields
 * @param documentFields
 * @returns A record of valid fields or a Response indicating an error or no updates
 */
export function getValidFields(
    fields: Record<string, unknown>,
    documentFields: DocumentFields
): Record<string, unknown> | Response {
    const validFields: Record<string, unknown> = {};

    for (const [id, value] of Object.entries(fields)) {
        if (!(id in documentFields)) continue;

        const field: DocumentField = documentFields[id];

        if (!field.properties.isUserUpdateable) continue;

        const isValid: boolean = validateFieldType(value, field.type);

        if (!isValid)
            return new Response(`Invalid value for field ${id}.`, {
                status: ResponseCodes.BadRequest,
            });

        validFields[id] = typeof value === "string" ? value.trim() : value;
    }

    // No updates were made
    if (Object.keys(validFields).length === 0)
        return new Response(null, {
            status: ResponseCodes.SuccessNoResponse,
        });

    return validFields;
}

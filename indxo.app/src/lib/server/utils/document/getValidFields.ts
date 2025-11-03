import type { DocumentFields } from "$lib/documents";
import { ResponseCodes } from "$lib/utils/apiResponses";
import { validateFieldType } from "$lib/utils/document/fields";

/**
 * Get valid fields from the provided fields object or return a Response indicating an error or no updates.
 *
 * @param fields
 * @param documentFields
 * @returns A record of valid fields or a Response indicating an error or no updates
 */
export default function getValidFields(
    fields: Record<string, unknown>,
    documentFields: DocumentFields
): Record<string, unknown> | Response {
    const validFields: Record<string, unknown> = {};

    for (const [id, value] of Object.entries(fields)) {
        const field = documentFields[id];

        if (!field || !field.properties.isUserUpdateable) continue;

        const isValid = validateFieldType(value, field.type);

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

import toggleDocumentInFavorites from "$lib/utils/toggleDocumentInFavorites";
import { error, json } from "@sveltejs/kit";

export async function GET({ params, locals }) {
    if (!locals.session) error(401, "Unauthorized.");

    const [success, favorite] = await toggleDocumentInFavorites("set", params.id, locals.user._id);

    if (!success) error(500, "Error toggling favorite.");

    return json(favorite);
}

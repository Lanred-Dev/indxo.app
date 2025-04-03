import { json } from "@sveltejs/kit";
import toggleDocumentInFavorites from "$lib/utils/toggleDocumentInFavorites";
import { error } from "@sveltejs/kit";

export async function GET({ params, locals }) {
    if (!locals.session) error(401, "Unauthorized.");

    const [success, favorite] = await toggleDocumentInFavorites(
        "folder",
        params.id,
        locals.user._id
    );

    return json({
        success,
        favorite,
    });
}

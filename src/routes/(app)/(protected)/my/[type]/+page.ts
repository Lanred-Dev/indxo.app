import type { CardDocumentType } from "$lib/components/Card/index.js";
import { MyPageType } from "$lib/utils/routing";

export async function load({ params, fetch, parent }) {
    const { user } = await parent();
    let response: Response;

    switch (params.type) {
        case MyPageType.favorites:
            response = await fetch(`/api/user/${user._id}/favorites`);
            break;
        case MyPageType.folders:
            response = await fetch(`/api/user/${user._id}/folders`);
            break;
        default:
            response = await fetch(`/api/user/${user._id}/sets`);
            break;
    }

    return {
        documents: (await response.json()) as CardDocumentType[],
    };
}

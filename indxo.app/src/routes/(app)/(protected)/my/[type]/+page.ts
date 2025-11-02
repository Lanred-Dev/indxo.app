import type { CardDocumentType } from "$lib/components/Card/index";
import { ResponseCodes } from "$lib/utils/apiResponses";
import { MyPageType } from "$lib/utils/routing";
import { error } from "@sveltejs/kit";

export async function load({ params, fetch, parent }) {
    const { type } = params;

    if (!Object.values(MyPageType).includes(type as MyPageType))
        error(ResponseCodes.NotFound, `${type} is not a valid my page type`);

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
        type: params.type as MyPageType,
    };
}

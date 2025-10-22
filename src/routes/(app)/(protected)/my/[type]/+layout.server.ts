import { ResponseCodes } from "$lib/utils/apiResponses.js";
import { MyPageType } from "$lib/utils/routing.js";
import { error } from "@sveltejs/kit";

export function load({ params }) {
    const { type } = params;

    if (!Object.values(MyPageType).includes(type as MyPageType))
        error(ResponseCodes.NotFound, `${type} is not a valid my page type`);

    return {
        type: type as MyPageType,
    };
}

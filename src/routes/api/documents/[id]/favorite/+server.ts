import { DocumentPermission, type User } from "$lib/documents";
import { loadCollection } from "$lib/server/mongo";
import { ResponseCodes, ResponseMessages } from "$lib/utils/apiResponses";
import { error, json } from "@sveltejs/kit";
import type { Collection } from "mongodb";

const users: Collection<User> = loadCollection("accounts", "users");

export async function GET({ params, locals, fetch }) {
    if (!locals.session) error(ResponseCodes.Unauthorized, ResponseMessages.Unauthorized);

    const hasPermissionFetch = await fetch(
        `/api/documents/${params.id}/permissions/${locals.user._id}`,
        {
            method: "POST",
            body: JSON.stringify(DocumentPermission.view),
        }
    );

    if (hasPermissionFetch.status !== ResponseCodes.SuccessNoResponse)
        error(hasPermissionFetch.status, await hasPermissionFetch.json());

    return json(locals.user.favorites.includes(params.id));
}

export async function PUT({ params, locals, fetch, request }) {
    if (!locals.session) error(ResponseCodes.Unauthorized, ResponseMessages.Unauthorized);

    const hasPermissionFetch = await fetch(
        `/api/documents/${params.id}/permissions/${locals.user._id}`,
        {
            method: "POST",
            body: JSON.stringify(DocumentPermission.view),
        }
    );

    if (hasPermissionFetch.status !== ResponseCodes.SuccessNoResponse)
        error(hasPermissionFetch.status, await hasPermissionFetch.json());

    const favorite: boolean = await request.json();

    // Check if the favorite status is already the same
    if (favorite === locals.user.favorites.includes(params.id))
        return new Response(null, {
            status: ResponseCodes.SuccessNoResponse,
        });

    await users.updateOne(
        { _id: locals.user._id },
        {
            [favorite ? "$pull" : "$addToSet"]: {
                favorites: params.id,
            },
        }
    );

    return new Response(null, {
        status: ResponseCodes.SuccessNoResponse,
    });
}

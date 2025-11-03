import {
    userFields,
    type OwnedDocument,
    type PublicFolder,
    type PublicSet,
    type PublicUser,
    type User,
} from "$lib/documents";
import { loadCollection } from "$lib/server/mongo";
import { getValidFields } from "$lib/server/utils/document/fields";
import { ResponseCodes, ResponseMessages } from "$lib/utils/apiResponses";
import { error, json } from "@sveltejs/kit";
import type { Collection } from "mongodb";

const users: Collection<User> = loadCollection("accounts", "users");

export async function GET({ params, fetch }) {
    const user: User | null = await users.findOne({ _id: params.id });

    if (!user) error(ResponseCodes.NotFound, ResponseMessages.NotFound);

    const sets: PublicSet[] = await (await fetch(`/api/user/${params.id}/sets`)).json();
    const folders: PublicFolder[] = await (await fetch(`/api/user/${params.id}/folders`)).json();
    const favorites: OwnedDocument[] = await (
        await fetch(`/api/user/${params.id}/favorites`)
    ).json();

    return json({
        _id: user._id,
        name: user.name,
        picture: user.picture,
        sets: sets,
        folders: folders,
        favorites: favorites,
        created: user.created,
    } satisfies PublicUser);
}

export async function DELETE({ params, locals, fetch }) {
    if (locals.user._id !== params.id)
        error(ResponseCodes.Unauthorized, "You are not authorized to delete this account.");

    const sets = await (await fetch(`/api/user/${params.id}/sets`)).json();
    const folders = await (await fetch(`/api/user/${params.id}/folders`)).json();

    for (const { _id } of [...folders, ...sets]) {
        await fetch(`/api/documents/${_id}`, {
            method: "DELETE",
        });
    }

    const deleteUserResult = await users.deleteOne({ _id: params.id });

    if (deleteUserResult.deletedCount === 0)
        error(ResponseCodes.ServerError, "Failed to delete user.");

    return new Response(null, { status: ResponseCodes.SuccessNoResponse });
}

export async function PUT({ params, locals, request }) {
    if (locals.user._id !== params.id)
        error(ResponseCodes.Unauthorized, "You are not authorized to update this account.");

    const validFields = getValidFields(await request.json(), userFields);

    if (validFields instanceof Response) return validFields;

    await users.updateOne(
        {
            _id: params.id,
        },
        {
            $set: validFields,
        }
    );

    return new Response(null, { status: ResponseCodes.SuccessNoResponse });
}

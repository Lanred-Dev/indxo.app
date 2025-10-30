import type { SortedSetMetadata, User } from "$lib/documents";
import { loadCollection } from "$lib/server/mongo.js";
import { findDocumentByID } from "$lib/server/utils/document/findByID.js";
import { ResponseCodes, ResponseMessages } from "$lib/utils/apiResponses.js";
import { error, json } from "@sveltejs/kit";
import type { Collection } from "mongodb";

const users: Collection<User> = loadCollection("accounts", "users");

export async function GET({ params }) {
    const user: User | null = await findDocumentByID(params.id);

    if (!user) error(ResponseCodes.NotFound, ResponseMessages.NotFound);

    return json(
        params.document in user.metadata.sets
            ? user.metadata.sets[params.document].sorting
            : ({
                  terms: {},
              } satisfies SortedSetMetadata)
    );
}

export async function PUT({ params, request }) {
    const user: User | null = await findDocumentByID(params.id);

    if (!user) error(ResponseCodes.NotFound, ResponseMessages.NotFound);

    if (!user.sets.includes(params.document))
        error(ResponseCodes.BadRequest, ResponseMessages.NotFound);

    const sorted: SortedSetMetadata["terms"] = await request.json();

    await users.updateOne(
        { _id: params.id },
        {
            $set: {
                [`metadata.sets.${params.document}.sorting`]: {
                    terms: sorted,
                } satisfies SortedSetMetadata,
            },
        }
    );

    return new Response(null, {
        status: ResponseCodes.SuccessNoResponse,
    });
}

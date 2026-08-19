import { DocumentPermission, type DocumentRating } from "$lib/documents";
import { loadCollection } from "$lib/server/mongo";
import { ResponseCodes, ResponseMessages } from "$lib/utils/apiResponses";
import { error, json } from "@sveltejs/kit";
import type { Collection } from "mongodb";
import type { RequestEvent } from "./$types";

const ratings: Collection<DocumentRating> = loadCollection("documents", "ratings");

export async function GET({ params, locals, fetch }: RequestEvent) {
    if (!locals.session) error(ResponseCodes.Unauthorized, ResponseMessages.Unauthorized);

    const hasPermissionFetch = await fetch(
        `/api/documents/${params.id}/permissions/${locals.user._id}`,
        {
            method: "POST",
            body: JSON.stringify(DocumentPermission.view),
        }
    );

    if (hasPermissionFetch.status !== ResponseCodes.Success)
        error(hasPermissionFetch.status, await hasPermissionFetch.json());

    const rating = await ratings.findOne({ _id: params.id });

    if (!rating) return json({ average: 0, reviews: [] });

    return json({
        average: rating.average,
        reviews: rating.reviews,
    });
}

export async function POST({ params, request, locals, fetch }: RequestEvent) {
    if (!locals.session) error(ResponseCodes.Unauthorized, ResponseMessages.Unauthorized);

    const hasPermissionFetch = await fetch(
        `/api/documents/${params.id}/permissions/${locals.user._id}`,
        {
            method: "POST",
            body: JSON.stringify(DocumentPermission.view),
        }
    );

    if (hasPermissionFetch.status !== ResponseCodes.Success)
        error(hasPermissionFetch.status, await hasPermissionFetch.json());

    const { id } = params;
    let { rating } = await request.json();

    if (isNaN(parseInt(rating))) error(ResponseCodes.BadRequest, "Rating must be a number.");

    rating = parseInt(rating);

    if (rating < 1 || rating > 5)
        error(ResponseCodes.BadRequest, "Rating must be between 1 and 5.");

    await ratings.updateOne(
        { _id: id },
        [
            {
                $set: {
                    reviews: {
                        $concatArrays: [
                            { $ifNull: ["$reviews", []] },
                            [{ rating: rating, user: locals.user._id }],
                        ],
                    },
                },
            },
            {
                $set: {
                    average: { $avg: "$reviews.rating" },
                },
            },
        ],
        { upsert: true }
    );
}

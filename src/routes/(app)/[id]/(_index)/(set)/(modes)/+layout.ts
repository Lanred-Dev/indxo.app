import type { PublicSet } from "$lib/documents";
import { ResponseCodes } from "$lib/utils/apiResponses";
import { redirect } from "@sveltejs/kit";

export async function load({ params, fetch }) {
    const response: Response = await fetch(`/api/documents/${params.id}`);

    if (response.status !== ResponseCodes.Success) redirect(response.status, `/${params.id}`);

    const set: PublicSet = await response.json();

    if (set.terms.length === 0) redirect(303, `/${params.id}`);

    return set;
}

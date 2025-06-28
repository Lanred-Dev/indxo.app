import { ResponseCodes } from "$lib/utils/apiResponses";
import { redirect } from "@sveltejs/kit";

export function load({ locals }) {
    if (locals.session) redirect(ResponseCodes.Redirect, "/");
}

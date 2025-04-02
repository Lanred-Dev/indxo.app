import type { PublicUser } from "$lib/database/documents/User";

export async function load({ fetch, params }) {
    const user: PublicUser = await (await fetch(`/api/account/${params.id}`)).json();

    return {
        ...user,
    };
}

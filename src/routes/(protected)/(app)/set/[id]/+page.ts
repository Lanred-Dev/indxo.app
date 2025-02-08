import type { Set } from "$lib/database/documents/Set";
import type { PublicUser } from "$lib/database/documents/User";

type SetWithOwnerData = Set & {
    ownerWithData: PublicUser;
};

export async function load({ fetch, params }) {
    const response = await fetch(`/api/documents/set/${params.id}`);

    if (response.status === 403) {
        return {
            permission: false,
        };
    }

    await fetch(`/api/documents/set/${params.id}/open`);

    const set: Set = await response.json();
    const owner: PublicUser = await (await fetch(`/api/account/${set.owner}`)).json();
    (set as SetWithOwnerData).ownerWithData = owner;

    return {
        ...(set as SetWithOwnerData),
    };
}

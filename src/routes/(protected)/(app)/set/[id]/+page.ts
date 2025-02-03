import type { Set } from "$lib/database/documents/Set";
import type { PublicUser } from "$lib/database/documents/User";

type SetWithOwnerData = Set & {
    ownerWithData: PublicUser;
};

export async function load({ fetch, params }) {
    const set: Set = await (await fetch(`/api/documents/set/${params.id}`)).json();

    // Add owner data
    const owner: PublicUser = await (await fetch(`/api/account/${set.owner}`)).json();
    (set as SetWithOwnerData).ownerWithData = owner;

    return {
        ...(set as SetWithOwnerData),
    };
}

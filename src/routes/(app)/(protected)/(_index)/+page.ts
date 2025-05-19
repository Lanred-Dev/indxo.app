import type { PublicFolder } from "$lib/database/documents/Folder";
import type { PublicSet } from "$lib/database/documents/Set";

type SectionTypes = "card";

export type SectionProperties = {
    title: string;
    type: SectionTypes;
    items: (PublicSet | PublicFolder)[];
    url?: string;
};

export async function load({ fetch, parent }) {
    const { user } = await parent();
    const sections: SectionProperties[] = [];

    for (const { id, endpoint } of user.preferences.home) {
        const {
            type,
            url,
            items,
        }: { type: SectionTypes; url?: string; items: (PublicSet | PublicFolder)[] } = await (
            await fetch(`/api/home/${endpoint}`)
        ).json();

        sections.push({
            title: id,
            type,
            url,
            items,
        });
    }

    return { sections };
}

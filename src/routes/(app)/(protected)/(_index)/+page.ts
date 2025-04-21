import type { PublicFolder } from "$lib/database/documents/Folder";
import type { PublicSet } from "$lib/database/documents/Set";
import type { HomeSection } from "$lib/database/documents/User";

type SectionTypes = "card";

export type SectionProperties = {
    title: string;
    type: SectionTypes;
    items: (PublicSet | PublicFolder)[];
    url?: string;
};

export async function load({ fetch }) {
    const userSections: HomeSection[] = await (await fetch("/api/home/sections")).json();
    const sections: SectionProperties[] = [];

    for (const [endpoint, title] of userSections) {
        const {
            type,
            url,
            items,
        }: { type: SectionTypes; url?: string; items: (PublicSet | PublicFolder)[] } = await (
            await fetch(`/api/home/feed/${endpoint}`)
        ).json();

        sections.push({
            title,
            type,
            url,
            items,
        });
    }

    return { sections };
}

import type { PublicFolder } from "$lib/database/documents/Folder.js";
import type { PublicSet } from "$lib/database/documents/Set.js";
import determineDocumentType from "$lib/utils/determineDocumentType.js";

type ItemProperties = PublicSet | PublicFolder;

type SectionTypes = "card";

export type SectionProperties = {
    title: string;
    type: SectionTypes;
    items: ItemProperties[];
    url?: string;
};

export async function load({ fetch }) {
    const preferences: string[] = await (await fetch("/api/home/preferences")).json();
    const sections: SectionProperties[] = [];

    for (const section of preferences) {
        const {
            type,
            url,
            items,
        }: { type: SectionTypes; url?: string; items: ItemProperties[] } = await (
            await fetch(`/api/home/feed/${section.toLowerCase().replaceAll(" ", "-")}`)
        ).json();

        // Limit the number of cards to 6
        items.splice(4);

        sections.push({
            title: section,
            type,
            url,
            items,
        });
    }

    return { sections };
}

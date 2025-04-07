import type { SimpleUser } from "$lib/database/documents/User.js";
import determineDocumentType from "$lib/utils/determineDocumentType.js";

export type itemProps = {
    name: string;
    description: string;
    isPublic: boolean;
    linkTo: string;
    owner: SimpleUser;
    [key: string]: any;
};

export type sectionTypes = "card";

export type sectionProps = {
    title: string;
    type: sectionTypes;
    items: itemProps[];
    linkTo?: string;
};

export async function load({ fetch }) {
    const preferences = await (await fetch("/api/home/preferences")).json();
    const sections: sectionProps[] = [];

    for (const section of preferences) {
        const { type, linkTo, items }: { type: sectionTypes; linkTo?: string; items: itemProps[] } =
            await (
                await fetch(`/api/home/feed/${section.toLowerCase().replaceAll(" ", "-")}`)
            ).json();

        // Add the `linkTo` property to each item
        for (const item of items) {
            const documentType = determineDocumentType(item);
            item.linkTo = `/${documentType}/${item._id.toString()}`;
        }

        // Limit the number of cards to 6
        items.splice(4);

        sections.push({
            title: section,
            type,
            linkTo,
            items,
        });
    }

    return sections;
}

import type { card, sectionType } from "./Section/Section.svelte";

export async function load({ fetch }) {
    const preferences = await (await fetch("/api/home/preferences")).json();
    const sections: {
        title: string;
        type: sectionType;
        cards: card[];
    }[] = [];

    for (const section of preferences) {
        const { type, cards }: { type: sectionType; cards: card[] } = await (
            await fetch(`/api/home/feed/${section.toLowerCase().replaceAll(" ", "-")}`)
        ).json();

        // Add the `linkTo` property to each card
        for (const card of cards) {
            card.linkTo = `/${type}/${card._id.toString()}`;
        }

        sections.push({
            title: section,
            type,
            cards,
        });
    }

    return {
        sections,
    };
}

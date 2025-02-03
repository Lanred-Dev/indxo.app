import type { card } from "./Section.svelte";

export async function load({ fetch }) {
    const preferences = await (await fetch("/api/home/preferences")).json();
    const sections: [string, card[]][] = [];

    for (const section of preferences) {
        const cards = await (
            await fetch(`/api/home/feed/${section.toLowerCase().replaceAll(" ", "-")}`)
        ).json();

        sections.push([section, cards]);
    }

    return {
        sections,
    };
}

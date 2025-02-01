import type { card } from "./Section.svelte";

export async function load({ fetch }) {
    const homeSectionPreferences = await (await fetch("/api/home/section-preferences")).json();
    const sections: [string, card[]][] = [];

    for (let index = 0; index < sections.length; index++) {
        const section: string = homeSectionPreferences.preferences[index];
        const api: string = `/api/home/feed/${section.toLowerCase().replaceAll(" ", "-")}`;
        const cards = await (await fetch(api)).json();

        sections.push([section, cards]);
    }

    return {
        sections,
    };
}

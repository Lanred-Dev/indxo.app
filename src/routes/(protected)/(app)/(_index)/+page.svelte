<script lang="ts">
    import Section, { type card } from "./Section.svelte";
    import type { PageData } from "./$types";

    let { data }: { data: PageData } = $props();

    function getSectionCards(section: string): Array<card> {
        const sectionApi: string = `/api/home/feed/${section.toLowerCase().replace(" ", "-")}`;
        return [];
    }
</script>

{#each data.sections as section}
    <Section title={section} cards={getSectionCards(section)} />
{/each}

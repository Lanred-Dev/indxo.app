<script lang="ts">
    import Section from "./Section.svelte";
    import type { PageData } from "./$types";

    let { data }: { data: PageData } = $props();
</script>

{#if data.sections.length === 0}
    <div class="x-center y-center">
        <p class="text-2xl">Make this your home!</p>
        <p class="text-light">You currently dont have any sections visible on your home page.</p>
    </div>
{:else}
    {#each data.sections as section}
        <Section
            title={typeof section[0] === "string" ? section[0] : ""}
            cards={Array.isArray(section[1]) ? section[1] : []}
        />
    {/each}
{/if}

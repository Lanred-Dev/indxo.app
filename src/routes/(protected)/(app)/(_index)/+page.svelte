<script lang="ts">
    import Section from "./Section.svelte";
    import type { PageData } from "./$types";

    let { data }: { data: PageData } = $props();
</script>

<svelte:head>
    <title>Home</title>
</svelte:head>

{#if data.sections.length === 0}
    <div class="mb-7 block">
        <p class="text-3xl font-bold">Make this your home!</p>
        <p class="text-light text-lg">
            You currently dont have any sections visible on your home page.
        </p>
    </div>

    <a class="primary block w-fit" href="/settings?edit=homeSectionPreferences">Edit preferences</a>
{:else}
    {#each data.sections as section}
        <Section
            title={typeof section[0] === "string" ? section[0] : ""}
            cards={Array.isArray(section[1]) ? section[1] : []}
        />
    {/each}
{/if}

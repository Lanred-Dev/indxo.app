<script lang="ts">
    import PageMessage from "$lib/components/PageMessage.svelte";
    import CardSection from "./Sections/Card.svelte";

    let { data } = $props();
</script>

<svelte:head>
    <title>Home</title>
</svelte:head>

{#if data.sections.length === 0}
    <PageMessage
        title="Make this your home!"
        text="You currently dont have any sections visible on your home page."
        button={["Edit preferences", "/settings?edit=homeSectionPreferences"]}
    />
{:else}
    <div class="w-full space-y-20">
        {#each data.sections as section}
            {#if section.type === "card"}
                <CardSection {...section} />
            {/if}
        {/each}

        <p class="text-center">You've reached the end of your feed!</p>
    </div>
{/if}

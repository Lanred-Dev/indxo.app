<script lang="ts">
    import CardSection from "./Sections/Card.svelte";

    let { data } = $props();
</script>

<svelte:head>
    <title>Home</title>
</svelte:head>

{#if data.sections.length === 0}
    <div class="page-message">
        <p>Make this your home!</p>
        <p>You currently dont have any sections visible on your home page.</p>
    </div>

    <a class="button-primary" href="/settings?edit=homeSections">Edit preferences</a>
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

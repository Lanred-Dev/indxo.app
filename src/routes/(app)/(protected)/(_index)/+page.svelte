<script lang="ts">
    let { data } = $props();
</script>

<svelte:head>
    <title>Home</title>
</svelte:head>

{#if data.sections.length === 0}
    <div class="page-title">
        <p class="page-title">Make this your home!</p>
        <p class="page-subtitle">You currently dont have any sections visible on your home page.</p>
    </div>

    <a class="button-primary" href="/settings?edit=homeSections">Edit preferences</a>
{:else}
    <div class="w-full space-y-20">
        {#each data.sections as section}
            pp
        {/each}

        <p class="text-center">You've reached the end of your feed!</p>
    </div>
{/if}

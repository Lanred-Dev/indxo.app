<script lang="ts">
    let { data } = $props();
</script>

<svelte:head>
    {#if data.found !== false}
        <title>{data.name} by {data.ownerWithData?.name}</title>
        <meta name="description" content={data.description} />
        <meta property="og:title" content={data.name} />
        <meta property="og:description" content={data.description} />
        <meta property="og:url" content={data.url} />
    {:else}
        <title>Not Found</title>
    {/if}
</svelte:head>

{#if data.found !== false}
    <div class="flex gap-0.5">
        <img
            src={data.ownerWithData?.image}
            alt={data.ownerWithData?.name}
            class="aspect-1 h-7 flex-shrink-0"
        />
        <p></p>
    </div>

    <h1>{data.name}</h1>
{:else}
    <p>Could not find set.</p>
{/if}

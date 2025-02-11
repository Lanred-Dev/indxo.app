<script lang="ts">
    import { onMount } from "svelte";

    let { data } = $props();

    onMount(async () => {
        await fetch(`/api/documents/set/${data._id}/open`);
    });
</script>

<svelte:head>
    {#if data.permission !== false}
        <title>{data.name} by {data.owner?.name}</title>
        <meta name="description" content={data.description} />
        <meta property="og:title" content={data.name} />
        <meta property="og:description" content={data.description} />
    {:else}
        <title>Not Found</title>
    {/if}
</svelte:head>

{#if data.permission !== false}
    <div class="flex gap-0.5">
        <img src={data.owner?.image} alt={data.owner?.name} class="size-7 flex-shrink-0" />
        <p>{data.owner?.name}</p>
    </div>

    <h1>{data.name}</h1>
{:else}
    <p>Could not find set.</p>
{/if}

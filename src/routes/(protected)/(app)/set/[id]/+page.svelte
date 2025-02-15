<script lang="ts">
    import PageMessage from "$lib/components/PageMessage.svelte";
    import { onMount } from "svelte";
    import Term from "./Term.svelte";

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

{#if data.permission === false}
    <PageMessage
        title="Sorry, couldn't find that set"
        text="The set you're looking for doesn't exist or you don't have permission to view it."
        button={["Go back", "/"]}
    />
{:else}
    <a class="flex-center gap-2" href="/account/{data.owner?._id}">
        <img
            src={data.owner?.image}
            alt={data.owner?.name}
            class="size-9 rounded-full border border-primary"
        />
        <p class="text-lg">{data.owner?.name}</p>
    </a>

    <div class="mt-8 space-y-4">
        <div class="space-y-1">
            <h1 class="text-5xl font-bold">{data.name}</h1>
            <p class="text-light text-xl">{data.subject}</p>
        </div>

        <p class="text-lg">{data.description}</p>
    </div>

    <div class="mt-8">
        {#each data.terms || [] as term}
            <Term {...term} />
        {/each}
    </div>
{/if}

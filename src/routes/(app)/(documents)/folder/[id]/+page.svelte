<script lang="ts">
    import PageMessage from "$lib/components/PageMessage.svelte";
    import determineWording from "$lib/utils/determineWording.js";
    import { formatDistanceToNow } from "date-fns";

    let { data } = $props();
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
        title="Sorry, couldn't find that {determineWording('folder')}."
        text="The {determineWording(
            'folder'
        )} you're looking for doesn't exist or you don't have permission to view it."
        button={["Go back", "/"]}
    />
{:else}
    <a class="flex-center gap-2" href="/account/{data.owner?._id}">
        <img
            src={data.owner?.image}
            alt={data.owner?.name}
            class="size-11 rounded-full border border-primary"
        />

        <div class="leading-tight">
            <p class="text-lg font-bold">{data.owner?.name}</p>
            <p class="text-light">
                Created {formatDistanceToNow(data.created || new Date(), {
                    includeSeconds: true,
                    addSuffix: true,
                })}
            </p>
        </div>
    </a>

    <div class="mt-6 space-y-4">
        <h1 class="text-5xl font-bold leading-tight">{data.name}</h1>
        <p class="text-lg">{data.description}</p>
    </div>

    <div class="mt-16 flex w-full flex-wrap gap-2"></div>
{/if}

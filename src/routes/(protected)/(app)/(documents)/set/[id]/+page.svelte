<script lang="ts">
    import PageMessage from "$lib/components/PageMessage.svelte";
    import Info from "./Info.svelte";
    import StudyCards from "./StudyCards.svelte";
    import type { PublicSet } from "$lib/database/documents/Set";
    import { onMount } from "svelte";

    let { data } = $props();

    onMount(async () => {
        await fetch(`/api/documents/set/${data.set?._id}/open`);
    });
</script>

<svelte:head>
    {#if data.permission !== false}
        <title>{data.set?.name} by {data.set?.owner?.name}</title>
        <meta name="description" content={data.set?.description} />
        <meta property="og:title" content={data.set?.name} />
        <meta property="og:description" content={data.set?.description} />
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
    <div class="flex w-4/5 items-center justify-between gap-2">
        <div>
            <a
                class="text-light text-xl leading-tight"
                href="/search?query={data.set?.subject}&returnOnly=set">{data.set?.subject}</a
            >
            <h1 class="text-5xl font-bold leading-none">{data.set?.name}</h1>
        </div>

        {#if data.hasEditPermission === true}
            <a href="/set/{data.set?._id}/edit">
                <img class="size-6" src="/icons/general/Pencil.svg" alt="Edit" />
            </a>
        {/if}
    </div>

    <StudyCards {...data.set as PublicSet} />

    <Info {...data.set as PublicSet} />
{/if}

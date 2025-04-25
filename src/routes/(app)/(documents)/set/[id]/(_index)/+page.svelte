<script lang="ts">
    import Info from "./Info.svelte";
    import StudyCards from "./StudyCards.svelte";
    import type { PublicSet } from "$lib/database/documents/Set";
    import { onMount } from "svelte";
    import Header from "./Header.svelte";
    import ModeSelector from "./ModeSelector.svelte";
    import { writable, type Writable } from "svelte/store";
    import determineWording from "$lib/utils/determineWording";

    let { data } = $props();

    let mode: Writable<string> = writable("cards");

    onMount(async () => {
        await fetch(`/api/documents/set/${data.set?._id}/open`);
    });
</script>

<svelte:head>
    {#if data.canView !== false}
        <title>{data.set?.name} by {data.set?.owner?.name}</title>
        <meta name="description" content={data.set?.description} />
        <meta property="og:title" content={data.set?.name} />
        <meta property="og:description" content={data.set?.description} />
    {:else}
        <title>Not Found</title>
    {/if}
</svelte:head>

{#if data.canView === false}
    <div class="page-message">
        <p>Sorry, couldn't find that {determineWording("set")}.</p>
        <p>
            The {determineWording("set")} you're looking for doesn't exist or you don't have permission
            to view it.
        </p>
    </div>

    <a class="button-primary" href="/">Go back</a>
{:else}
    <Header
        set={data.set as PublicSet}
        isFavorite={data.isFavorite ?? false}
        hasPermission={data.hasPermission ?? false}
    />

    <StudyCards {...data.set?.terms ?? []} />

    <Info {...data.set as PublicSet} />

    <ModeSelector id={data.set?._id ?? ""} {mode} />
{/if}

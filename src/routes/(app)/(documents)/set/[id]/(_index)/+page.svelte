<script lang="ts">
    import Info from "./Info.svelte";
    import Study from "./Study.svelte";
    import type { PublicSet } from "$lib/database/documents/Set";
    import ModeSelector from "./ModeSelector.svelte";
    import determineWording from "$lib/utils/determineWording";
    import Terms from "./Terms.svelte";
    import DocumentHeader from "../../../DocumentHeader.svelte";
    import Struggling from "./Struggling.svelte";

    let { data } = $props();
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
    <DocumentHeader
        type="set"
        document={data.set as PublicSet}
        isFavorite={data.isFavorite ?? false}
        hasPermission={data.hasPermission ?? false}
    />

    <Study {...data.set?.terms ?? []} />

    <Info {...data.set as PublicSet} />

    {#if data.set?.terms.length ?? 0 > 0}
        <ModeSelector
            id={data.set?._id ?? ""}
            modes={[
                {
                    text: determineWording("sort"),
                    icon: "/icons/general/Star.svg",
                    endpoint: "sort",
                },
                {
                    text: determineWording("matching"),
                    icon: "/icons/general/Star.svg",
                    endpoint: "matching",
                },
                {
                    text: determineWording("test"),
                    icon: "/icons/general/Star.svg",
                    endpoint: "quiz",
                },
            ]}
        />

        <Struggling saved={data.saved ?? []} terms={data.set?.terms ?? []} />

        <Terms terms={data.set?.terms ?? []} hasPermission={data.hasPermission ?? false} />
    {/if}
{/if}

<script lang="ts">
    import SearchableList from "$lib/components/SearchableList";
    import type { PublicFolder } from "$lib/database/documents/Folder";
    import determineWording from "$lib/utils/determineWording";
    import DocumentHeader from "../../../DocumentHeader.svelte";
    import Info from "./Info.svelte";

    let { data } = $props();
</script>

<svelte:head>
    {#if data.canView !== false}
        <title>{data.folder?.name} by {data.folder?.owner?.name}</title>
        <meta name="description" content={data.folder?.description} />
        <meta property="og:title" content={data.folder?.name} />
        <meta property="og:description" content={data.folder?.description} />
    {:else}
        <title>Not Found</title>
    {/if}
</svelte:head>

{#if data.canView === false}
    <div class="page-message">
        <p>Sorry, couldn't find that {determineWording("folder")}.</p>
        <p>
            The {determineWording("folder")} you're looking for doesn't exist or you don't have permission
            to view it.
        </p>
    </div>

    <a class="button-primary" href="/">Go back</a>
{:else}
    <DocumentHeader
        type="folder"
        document={data.folder as PublicFolder}
        isFavorite={data.isFavorite ?? false}
        hasPermission={data.hasPermission ?? false}
    />

    <Info {...data.folder as PublicFolder} />

    <SearchableList
        items={data.folder?.sets ?? []}
        filter="alphabetical"
        filters={[
            { value: "created", text: "Created" },
            { value: "subject", text: "Subject" },
            { value: "alphabetical", text: "Alphabetical" },
            { value: "none", text: "None" },
        ]}
    />
{/if}

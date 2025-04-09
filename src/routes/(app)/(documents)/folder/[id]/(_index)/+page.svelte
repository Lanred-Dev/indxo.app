<script lang="ts">
    import PageMessage from "$lib/components/PageMessage.svelte";
    import type { PublicFolder } from "$lib/database/documents/Folder";
    import type { PublicSet } from "$lib/database/documents/Set";
    import determineWording from "$lib/utils/determineWording";
    import Header from "./Header.svelte";
    import Info from "./Info.svelte";
    import List from "./List.svelte";

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
    <PageMessage
        title="Sorry, couldn't find that {determineWording('folder')}."
        text="The {determineWording(
            'folder'
        )} you're looking for doesn't exist or you don't have permission to view it."
        button={["Go back", "/"]}
    />
{:else}
    <Header
        folder={data.folder as PublicFolder}
        isFavorite={data.isFavorite ?? false}
        hasPermission={data.hasPermission ?? false}
    />

    <Info {...data.folder as PublicFolder} />

    <List {...data.folder?.sets as PublicSet[]} />
{/if}

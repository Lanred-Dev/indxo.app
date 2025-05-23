<script lang="ts">
    import SearchableList from "$lib/components/SearchableList.svelte";
    import determineWording from "$lib/utils/determineWording";

    let { data } = $props();
</script>

<svelte:head>
    <title>Your {determineWording("sets")}</title>
</svelte:head>

<div class="page-title">
    <p class="page-subtitle">Browse your library</p>
    <h1 class="page-title">Your {determineWording("sets")}</h1>
</div>

<SearchableList
    items={data.documents}
    filter={"created"}
    filters={[
        { value: "created", text: "Created" },
        { value: "subject", text: "Subject" },
        { value: "alphabetical", text: "Alphabetical" },
        { value: "none", text: "None" },
    ]}
/>

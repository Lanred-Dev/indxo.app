<script lang="ts">
    import SearchableList from "$lib/components/SearchableList.svelte";
    import determineWording from "$lib/utils/determineWording";

    let { data } = $props();
</script>

<svelte:head>
    <title>Your {determineWording("favorites")}</title>
</svelte:head>

<div class="page-title mb-12">
    <p>Browse your library</p>
    <h1>Your {determineWording("favorites")}</h1>
</div>

<SearchableList
    items={data.documents}
    filter={"alphabetical"}
    filters={[
        { value: "created", text: "Created" },
        { value: "subject", text: "Subject" },
        { value: "alphabetical", text: "Alphabetical" },
        { value: "none", text: "None" },
    ]}
/>

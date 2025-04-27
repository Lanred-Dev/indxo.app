<script lang="ts">
    import SearchableList from "$lib/components/SearchableList/SearchableList.svelte";
    import determineWording from "$lib/utils/determineWording.js";

    let { data } = $props();
</script>

<svelte:head>
    <title>Your {determineWording("sets")}</title>
</svelte:head>

<div class="page-title mb-12">
    <p>Browse your library</p>
    <h1>Your {determineWording("sets")}</h1>
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

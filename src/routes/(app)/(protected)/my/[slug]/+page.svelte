<script lang="ts">
    import { page } from "$app/state";
    import SearchableList from "$lib/components/SearchableList/SearchableList.svelte";
    import determineWording from "$lib/utils/determineWording.js";

    let { data } = $props();

    let type: "sets" | "folders" | "favorites" = $derived(page.params.slug as any);
</script>

<svelte:head>
    <title>Your {determineWording(type)}</title>
</svelte:head>

<div class="page-title">
    <p>Browse your library</p>
    <h1>Your {determineWording(type)}</h1>
</div>

<SearchableList
    items={data.documents}
    filter={type === "favorites" ? "alphabetical" : "created"}
    filters={type === "folders"
        ? [
              { value: "created", text: "Created" },
              { value: "alphabetical", text: "Alphabetical" },
              { value: "none", text: "None" },
          ]
        : [
              { value: "created", text: "Created" },
              { value: "subject", text: "Subject" },
              { value: "alphabetical", text: "Alphabetical" },
              { value: "none", text: "None" },
          ]}
/>

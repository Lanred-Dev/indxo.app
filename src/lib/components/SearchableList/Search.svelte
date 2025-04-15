<script lang="ts">
    import Dropdown, { type ItemProperties } from "$lib/components/Dropdown.svelte";

    export type SortFilters = "none" | "created" | "subject" | "alphabetical";

    let {
        query = $bindable(""),
        filter = $bindable("created"),
        filters = [],
    }: {
        query: string;
        filter: SortFilters;
        filters: ItemProperties[];
    } = $props();
</script>

<div class="mb-10 flex w-full items-center gap-4">
    <Dropdown bind:value={filter} items={filters} />

    <div class="input-primary flex-center w-full gap-2">
        <img class="size-6" src="/icons/general/Search.svg" alt="Search" />

        <input
            class="w-full border-0 bg-transparent p-0 text-lg outline-hidden focus:ring-0"
            type="text"
            placeholder="Cant find something?"
            bind:value={query}
        />
    </div>
</div>

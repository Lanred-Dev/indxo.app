<script lang="ts">
    import Dropdown, { type itemProps } from "$lib/components/Dropdown.svelte";

    export type sortFilter = "none" | "created" | "subject" | "alphabetical";

    let {
        searchQuery = $bindable(""),
        userSortFilter = $bindable("created"),
        hideSubjectFilter = false,
    }: {
        searchQuery: string;
        userSortFilter: sortFilter;
        hideSubjectFilter?: boolean;
    } = $props();

    let sortFilters: itemProps[] = $derived.by(() => {
        const filters: itemProps[] = [
            { value: "created", text: "Created" },
            { value: "alphabetical", text: "Alphabetical" },
            { value: "subject", text: "Subject" },
            { value: "none", text: "None" },
        ];

        if (hideSubjectFilter) filters.splice(2, 1);

        return filters;
    });
</script>

<div class="flex w-full items-center gap-4 pt-12 pb-16">
    <Dropdown bind:value={userSortFilter} items={sortFilters} />

    <div class="input-primary flex-center w-full gap-2">
        <img class="size-6" src="/icons/general/Search.svg" alt="Search" />

        <input
            class="w-full border-0 bg-transparent p-0 text-lg outline-hidden focus:ring-0"
            type="text"
            placeholder="Cant find something?"
            bind:value={searchQuery}
        />
    </div>
</div>

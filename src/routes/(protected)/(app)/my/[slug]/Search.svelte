<script lang="ts">
    import Dropdown from "$lib/components/Dropdown";
    import type { props as DropdownItemProps } from "$lib/components/Dropdown/DropdownItem.svelte";

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

    let sortFilters: DropdownItemProps[] = $derived.by(() => {
        const filters: DropdownItemProps[] = [
            { value: "created", text: "Created" },
            { value: "alphabetical", text: "Alphabetical" },
            { value: "subject", text: "Subject" },
            { value: "none", text: "None" },
        ];

        if (hideSubjectFilter) filters.splice(2, 1);

        return filters;
    });
</script>

<div class="flex w-full items-center gap-4 pb-16 pt-12">
    <Dropdown bind:value={userSortFilter} items={sortFilters} />

    <div class="input-primary flex-center w-full gap-2">
        <img class="size-6" src="/icons/general/Search.svg" alt="Search" />

        <input
            class="w-full border-0 bg-transparent p-0 text-lg outline-none focus:ring-0"
            type="text"
            placeholder="Cant find something?"
            bind:value={searchQuery}
        />
    </div>
</div>

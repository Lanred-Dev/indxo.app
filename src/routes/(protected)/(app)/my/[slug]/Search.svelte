<script lang="ts">
    import Dropdown from "$lib/components/Dropdown";
    import type { props as DropdownItemProps } from "$lib/components/Dropdown/DropdownItem.svelte";

    export type sortFilters = "none" | "created" | "subject" | "alphabetical";

    let {
        searchQuery = $bindable(""),
        userSortFilter = $bindable("created"),
    }: { searchQuery: string; userSortFilter: sortFilters } = $props();

    let sortFilterDropdownValue: DropdownItemProps = $state({ value: "created", text: "Created" });

    $effect(() => {
        userSortFilter = sortFilterDropdownValue.value as sortFilters;
    });
</script>

<div class="flex w-full items-center gap-4 pb-16 pt-12">
    <div class="input-primary flex-center w-3/5 gap-2">
        <img class="size-6" src="/icons/general/Search.svg" alt="Search" />

        <input
            class="w-full border-0 bg-transparent p-0 text-lg outline-none focus:ring-0"
            type="text"
            placeholder="Cant find something?"
            bind:value={searchQuery}
        />
    </div>

    <Dropdown
        bind:currentValue={sortFilterDropdownValue}
        items={[
            { value: "created", text: "Created" },
            { value: "subject", text: "Subject" },
            { value: "alphabetical", text: "Alphabetical" },
            { value: "none", text: "None" },
        ]}
    />
</div>

<script lang="ts">
    import { Dropdown, DropdownItem } from "$lib/components/Dropdown";

    export type sortFilters = "none" | "created" | "subject" | "alphabetical";

    let {
        searchQuery = $bindable(""),
        userSortFilter = $bindable("created"),
    }: { searchQuery: string; userSortFilter: sortFilters } = $props();
</script>

<div class="flex w-full items-center gap-4 pb-16 pt-12">
    <div data-input class="flex-center w-3/5 gap-2">
        <img class="size-6" src="/icons/general/Search.svg" alt="Search" />

        <input
            class="w-full border-0 bg-transparent p-0 text-lg outline-none focus:ring-0"
            type="text"
            placeholder="Cant find something?"
            bind:value={searchQuery}
        />
    </div>

    <Dropdown
        classes="text-lg"
        placeholder={{ value: "created", text: "Created" }}
        bind:currentRawValue={userSortFilter}
    >
        <DropdownItem value="created" text="Created" />
        <DropdownItem value="subject" text="Subject" />
        <DropdownItem value="alphabetical" text="Alphabetical" />
        <DropdownItem value="none" text="None" />
    </Dropdown>
</div>

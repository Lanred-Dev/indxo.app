<script lang="ts">
    import { DropdownContent, DropdownItem, DropdownTrigger } from "$lib/components/Dropdown";
    import Dropdown from "$lib/components/Dropdown/Dropdown.svelte";
    import { getContext } from "svelte";
    import { searchableListContextKey, type SearchableListContext } from ".";
    import type { SearchableListFilter } from "./filters";

    let { filters }: { filters: SearchableListFilter[] } = $props();

    const searchableList: SearchableListContext = getContext(searchableListContextKey);

    let currentFilterID: string = $state.raw(filters[0]?.id ?? "");

    $effect(() => {
        searchableList.setFilter(filters.find(({ id }) => id === currentFilterID)!);
    });
</script>

<div class="mb-10 flex w-full flex-wrap items-center gap-2 gap-x-5">
    <Dropdown bind:value={currentFilterID}>
        <DropdownTrigger />

        <DropdownContent>
            {#each filters as { id, name }}
                <DropdownItem value={id}>
                    {name}
                </DropdownItem>
            {/each}
        </DropdownContent>
    </Dropdown>

    <div class="input-primary flex-center grow gap-2">
        <img class="size-6" src="/icons/general/Search.svg" alt="Search" />

        <input
            class="field-sizing-content w-full border-0 bg-transparent p-0 text-lg outline-none focus:ring-0"
            type="text"
            placeholder="Cant find something?"
            bind:value={searchableList.query}
        />
    </div>
</div>

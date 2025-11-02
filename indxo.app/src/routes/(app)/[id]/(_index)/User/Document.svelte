<script lang="ts">
    import { getContext } from "svelte";
    import type { DocumentContext } from "../+page.svelte";
    import {
        EmptyListState,
        SearchableListContent,
        SearchableListError,
        SearchableListFilters,
        SearchableListSearchbar,
    } from "$lib/components/Lists/Searchable";
    import SearchableList from "$lib/components/Lists/Searchable/SearchableList.svelte";
    import Dropdown from "$lib/components/Dropdown/Dropdown.svelte";
    import { DropdownContent, DropdownItem, DropdownTrigger } from "$lib/components/Dropdown";

    const document: DocumentContext = getContext("document");

    const filters: {
        [id: string]: {
            text: string;
            id: string;
        };
    } = {
        sets: { text: "Sets", id: "s" },
        folders: { text: "Folders", id: "f" },
        favorites: { text: "Favorites", id: "fav" },
    };

    let currentFilterID: string = $state.raw(filters.sets.id);
    let documents: any[] = $derived.by(() => {
        switch (currentFilterID) {
            case filters.sets.id:
                return document.sets;
            case filters.folders.id:
                return document.folders;
            case filters.favorites.id:
                return document.favorites;
            default:
                return [];
        }
    });
</script>

<Dropdown bind:value={currentFilterID}>
    <DropdownTrigger />

    <DropdownContent>
        {#each Object.values(filters) as { id, text }}
            <DropdownItem value={id}>
                {text}
            </DropdownItem>
        {/each}
    </DropdownContent>
</Dropdown>

<SearchableList {documents}>
    <SearchableListSearchbar
        filters={[
            SearchableListFilters.alphabetical,
            SearchableListFilters.created,
            SearchableListFilters.none,
        ]}
    />

    <SearchableListContent />

    <SearchableListError
        states={{
            [EmptyListState.noDocuments]: {
                image: "/icons/general/RaisedHand.svg",
                title: "Echoes... Just Echoes",
                message: "Nothing’s here yet. Maybe it’s time to start something awesome?",
            },
            [EmptyListState.noSearchResults]: {
                image: "/icons/general/Search.svg",
                title: "No Matches in Sight",
                message: "You’ve outsmarted the search bar. Try a different word or two?",
            },
        }}
    />
</SearchableList>

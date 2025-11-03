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
    import { SegmentedButton, SegmentedButtonGroup } from "$lib/components/SegmentedButtonGroup";
    import type { SearchableListFilter } from "$lib/components/Lists/Searchable/filters";
    import { Wording } from "$lib/utils/wording";

    const document: DocumentContext = getContext("document");

    enum DocumentPageType {
        sets = "s",
        folders = "f",
    }

    const documentPageFilters: {
        [id: string]: {
            text: string;
            id: DocumentPageType;
        };
    } = {
        sets: { text: "Sets", id: DocumentPageType.sets },
        folders: { text: "Folders", id: DocumentPageType.folders },
    };

    let currentFilterID: DocumentPageType = $state.raw(documentPageFilters.sets.id);
    let documents: any[] = $derived.by(() => {
        switch (currentFilterID) {
            case documentPageFilters.sets.id:
                return document.sets;
            case documentPageFilters.folders.id:
                return document.folders;
            default:
                return [];
        }
    });
    let filters: SearchableListFilter[] = $derived.by(() => {
        let baseFilters: SearchableListFilter[] = [
            SearchableListFilters.alphabetical,
            SearchableListFilters.created,
            SearchableListFilters.none,
        ];

        if (currentFilterID === DocumentPageType.sets)
            baseFilters.push(SearchableListFilters.subject);

        return baseFilters;
    });
</script>

<SegmentedButtonGroup bind:value={currentFilterID} class="mb-6">
    {#each Object.values(documentPageFilters) as { id, text }}
        <SegmentedButton {id}>
            {text}
        </SegmentedButton>
    {/each}
</SegmentedButtonGroup>

<SearchableList {documents}>
    <SearchableListSearchbar {filters} />

    <SearchableListContent />

    <SearchableListError
        states={{
            [EmptyListState.noDocuments]: {
                image: "/icons/general/RaisedHand.svg",
                title: "Echoes... Just Echoes",
                message: `${document.name} doesnt have any ${currentFilterID === DocumentPageType.sets ? Wording.sets.toLowerCase() : Wording.folders.toLowerCase()} yet.`,
            },
            [EmptyListState.noSearchResults]: {
                image: "/icons/general/Search.svg",
                title: "No Matches in Sight",
                message: "You’ve outsmarted the search bar. Try a different word or two?",
            },
        }}
    />
</SearchableList>

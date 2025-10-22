import type { CardDocumentType, CardGroup } from "$lib/components/Card";
import type { ComponentProps } from "svelte";
import type { SearchableListFilter } from "./filters";

export { default as SearchableListContent } from "./Content.svelte";
export { default as SearchableListError } from "./Error.svelte";
export { default as SearchableListFilters } from "./filters";
export { default as SearchableList } from "./SearchableList.svelte";
export { default as SearchableListSearchbar } from "./Searchbar.svelte";

export enum EmptyListState {
    noDocuments = "noDocuments",
    noSearchResults = "noSearchResults",
}

export interface SearchableListContext {
    query: string;
    documents: CardDocumentType[];
    groups: ComponentProps<typeof CardGroup>[];
    setFilter: (newFilter: SearchableListFilter) => void;
}

export let searchableListContextKey: Symbol = Symbol("searchableListContextKey");

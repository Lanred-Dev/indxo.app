<script lang="ts">
    import type { CardDocumentType, CardGroup } from "$lib/components/Card";
    import { setContext, type ComponentProps, type Snippet } from "svelte";
    import { searchableListContextKey, type SearchableListContext } from ".";
    import type { SearchableListFilter } from "./filters";

    let {
        documents = [],
        children,
    }: {
        documents: CardDocumentType[];
        children: Snippet<[]>;
    } = $props();

    let query: string = $state.raw("");
    let filter: SearchableListFilter | null = $state.raw(null);
    let groups: ComponentProps<typeof CardGroup>[] = $derived.by(() => {
        if (!filter) return [{ documents }];

        return filter.apply(query, documents);
    });

    setContext(searchableListContextKey, {
        get query() {
            return query;
        },
        set query(newValue) {
            query = newValue.trim();
        },
        get documents() {
            return documents;
        },
        get groups() {
            return groups;
        },
        setFilter: (newFilter) => {
            filter = newFilter;
        },
    } satisfies SearchableListContext);
</script>

{@render children()}

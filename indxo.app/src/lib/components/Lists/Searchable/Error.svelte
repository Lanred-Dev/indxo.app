<script lang="ts">
    import { getContext } from "svelte";
    import { searchableListContextKey, EmptyListState, type SearchableListContext } from ".";

    type State = {
        image: string;
        title: string;
        message: string;
    };

    let { states }: { states: { [key in EmptyListState]: State } } = $props();

    const searchableList: SearchableListContext = getContext(searchableListContextKey);
    let state: State | null = $derived.by(() => {
        if (searchableList.documents.length === 0) {
            return states[EmptyListState.noDocuments];
        } else if (searchableList.groups.length === 0 && searchableList.query.length > 0) {
            return states[EmptyListState.noSearchResults];
        } else {
            return null;
        }
    });
</script>

{#if state !== null}
    <div class="page-title flex-center flex-col space-y-1 py-20 text-center">
        <h1 class="title">
            <img src={state.image} alt="Error" />
            {state.title}
        </h1>

        <p>{state.message}</p>
    </div>
{/if}

<script lang="ts">
    import { CardGroup } from "$lib/components/Card";
    import { getContext } from "svelte";
    import { searchableListContextKey, type SearchableListContext } from ".";

    const searchableList: SearchableListContext = getContext(searchableListContextKey);
</script>

<div class="flex w-full flex-col gap-10">
    {#each searchableList.groups as group}
        <CardGroup {...group} />
    {/each}
</div>

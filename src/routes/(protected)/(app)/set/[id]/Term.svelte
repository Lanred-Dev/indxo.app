<script lang="ts">
    import type { Term } from "$lib/database/documents/Set";

    let { term, definition, image }: Term = $props();

    let showDefinition: boolean = $state(false);
</script>

<div>
    {#if showDefinition}
        <p>{definition}</p>
    {:else}
        <p>{term}</p>
    {/if}
</div>

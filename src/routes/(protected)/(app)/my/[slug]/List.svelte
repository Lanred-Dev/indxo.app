<script lang="ts">
    import FolderCard from "./Cards/Folder.svelte";
    import SetCard from "./Cards/Set.svelte";
    import type { PublicFolder } from "$lib/database/documents/Folder";
    import type { PublicSet } from "$lib/database/documents/Set";
    import determineDocumentType from "$lib/utils/determineDocumentType";

    export type group = [(PublicFolder | PublicSet)[], string | null];

    let groups: group[] = $props();
</script>

<div class="w-full space-y-10">
    {#each groups as [items, name]}
        <div>
            {#if typeof name === "string" && name.length > 0}
                <p class="section-title mb-3">{name}</p>
            {/if}

            <div class="space-y-2.5">
                {#each items as item}
                    {#if determineDocumentType(item) === "folder"}
                        <FolderCard {...item as PublicFolder} />
                    {:else if determineDocumentType(item) === "set"}
                        <SetCard {...item as PublicSet} />
                    {/if}
                {/each}
            </div>
        </div>
    {/each}
</div>

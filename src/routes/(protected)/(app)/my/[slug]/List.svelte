<script lang="ts">
    import type { PublicFolder } from "$lib/database/documents/Folder";
    import type { PublicSet } from "$lib/database/documents/Set";
    import type { Component } from "svelte";

    export type props = {
        groups: [(PublicFolder | PublicSet)[], string | null][];
        CardComponent: Component<PublicFolder | PublicSet, {}, "">;
    };

    let { groups, CardComponent }: props = $props();
</script>

<div class="w-full space-y-8">
    {#each groups as [items, name]}
        <div class="space-y-2">
            {#if typeof name === "string" && name.length > 0}
                <p class="text-dark text-xl font-bold">{name}</p>
            {/if}

            <div class="space-y-2">
                {#each items as item}
                    <CardComponent {...item} />
                {/each}
            </div>
        </div>
    {/each}
</div>

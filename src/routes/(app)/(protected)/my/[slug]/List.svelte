<script lang="ts">
    import type { PublicFolder } from "$lib/database/documents/Folder";
    import type { PublicSet } from "$lib/database/documents/Set";
    import determineDocumentType from "$lib/utils/determineDocumentType";
    import Card from "$lib/components/Card.svelte";
    import determineWording from "$lib/utils/determineWording";

    export type group = [(PublicFolder | PublicSet)[], string | null];

    let groups: group[] = $props();
</script>

<div class="w-full space-y-10">
    {#each groups as [items, name]}
        <div class="list-primary">
            {#if typeof name === "string" && name.length > 0}
                <p class="list-title">{name}</p>
            {/if}

            <ul class="list flex-col">
                {#each items as item}
                    <li>
                        {#if determineDocumentType(item) === "folder"}
                            <Card
                                name={item.name}
                                description={item.description}
                                url={`/folder/${item._id}`}
                                icon={(item as PublicFolder).icon}
                                meta={[
                                    `${(item as PublicFolder).sets.length} ${determineWording((item as PublicFolder).sets.length === 1 ? "set" : "sets")}`,
                                ]}
                            />
                        {:else if determineDocumentType(item) === "set"}
                            <Card
                                name={item.name}
                                description={item.description}
                                url={`/set/${item._id}`}
                                meta={[
                                    (item as PublicSet).subject,
                                    `${(item as PublicSet).terms.length} ${determineWording((item as PublicSet).terms.length === 1 ? "term" : "terms")}`,
                                ]}
                            />
                        {/if}
                    </li>
                {/each}
            </ul>
        </div>
    {/each}
</div>

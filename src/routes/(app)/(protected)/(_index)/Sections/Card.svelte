<script lang="ts">
    import Card from "$lib/components/Card.svelte";
    import determineDocumentType from "$lib/utils/determineDocumentType";
    import type { SectionProperties } from "../+page";

    let { title, items, url }: SectionProperties = $props();
</script>

<div class="list-primary">
    <div class="{url ? 'flex items-center justify-between' : ''} w-full px-3">
        <p class="list-title">{title}</p>

        {#if url}
            <a class="text-light" href={url}>View all</a>
        {/if}
    </div>

    <ul class="list grid grid-cols-2 grid-rows-2">
        {#each items as item}
            {#if determineDocumentType(item) === "folder"}
                <Card
                    name={item.name}
                    description={item.description}
                    url={`/folder/${item._id}`}
                    icon={(item as PublicFolder).icon}
                    meta={[
                        `by ${item.owner.name.split(" ")[0]}`,
                        `${(item as PublicFolder).sets.length} ${determineWording((item as PublicFolder).sets.length === 1 ? "set" : "sets")}`,
                    ]}
                />
            {:else if determineDocumentType(item) === "set"}
                <Card
                    name={item.name}
                    description={item.description}
                    url={`/set/${item._id}`}
                    meta={[
                        `by ${item.owner.name.split(" ")[0]}`,
                        (item as PublicSet).subject,
                        `${(item as PublicSet).terms.length} ${determineWording((item as PublicSet).terms.length === 1 ? "term" : "terms")}`,
                    ]}
                />
            {/if}
        {/each}
    </ul>
</div>

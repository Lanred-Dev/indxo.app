<script lang="ts">
    import type { PublicFolder } from "$lib/database/documents/Folder";
    import type { PublicSet } from "$lib/database/documents/Set";
    import determineDocumentType from "$lib/utils/determineDocumentType";
    import Card from "$lib/components/Card.svelte";
    import determineWording from "$lib/utils/determineWording";
    import { slide } from "svelte/transition";

    export interface Group {
        name: string;
        items: (PublicFolder | PublicSet)[];
    }

    let { name, items }: Group = $props();

    let visible: boolean = $state.raw(true);
</script>

<div class="list-primary">
    {#if typeof name === "string" && name.length > 0}
        <button class="flex-center gap-1" onclick={() => (visible = !visible)}>
            <p class="list-title">{name}</p>

            <img
                class="size-4"
                src="/icons/general/{visible ? 'UpChevron' : 'DownChevron'}.svg"
                alt="Arrow {visible ? 'up' : 'down'}"
            />
        </button>
    {/if}

    {#if visible}
        <ul class="list flex-col" in:slide out:slide>
            {#each items as item}
                <li>
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
                </li>
            {/each}
        </ul>
    {/if}
</div>

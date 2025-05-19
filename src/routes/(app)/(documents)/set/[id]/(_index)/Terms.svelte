<script lang="ts">
    import EditableList from "$lib/components/Form/EditableList/EditableList.svelte";
    import type { Term } from "$lib/database/documents/Set";
    import determineWording from "$lib/utils/determineWording";

    let { terms, hasPermission }: { terms: Term[]; hasPermission: boolean } = $props();
</script>

<div class="list-primary mt-16">
    <p class="list-title">{determineWording("cards")}</p>

    <div class="list-primary">
        {#if hasPermission}
            <EditableList
                addText="Add {determineWording('card')}"
                isDraggable={true}
                items={terms.map(({ _id, term, definition }) => ({
                    _id,
                    properties: {
                        term,
                        definition,
                    },
                }))}
                properties={[
                    {
                        _id: "term",
                        type: "input",
                        placeholder: "Term",
                    },
                    {
                        _id: "definition",
                        type: "textarea",
                        placeholder: "Definition",
                    },
                ]}
            />
        {:else}
            <ol class="flex flex-col gap-4">
                {#each terms as { term, definition }, listID}
                    <li class="container-primary flex">
                        <p class="mr-3 text-lg font-bold">#{listID + 1}</p>

                        <div>
                            <p class="text-lg font-bold">{term}</p>
                            <p class="mt-0.5 text-lg leading-none">{definition}</p>
                        </div>
                    </li>
                {/each}
            </ol>
        {/if}
    </div>
</div>

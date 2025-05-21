<script lang="ts">
    import EditableList from "$lib/components/Form/EditableList/EditableList.svelte";
    import type { Term } from "$lib/database/documents/Set";
    import determineWording from "$lib/utils/determineWording";
    import generateRandomID from "$lib/utils/generateRandomID";
    import TermCard from "./TermCard.svelte";

    let { terms, hasPermission }: { terms: Term[]; hasPermission: boolean } = $props();
</script>

<div class="list-primary mt-16">
    <p class="list-title">{determineWording("cards")}</p>

    <div class="list-primary">
        {#if hasPermission}
            <EditableList
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
            >
                {#snippet controls(addItem: any)}
                    <div class="x-center sticky! bottom-0 z-20 w-1/2 pt-4">
                        <div class="container-primary flex justify-between gap-2 p-2">
                            <button
                                class="button-primary w-full"
                                onclick={() => addItem(generateRandomID(5))}
                                type="button"
                            >
                                <img src="/icons/general/Plus.svg" alt="Plus" />
                                New
                            </button>

                            <button class="button-attention w-full" type="button">Update</button>
                        </div>
                    </div>
                {/snippet}
            </EditableList>
        {:else}
            <ol class="flex flex-col gap-4">
                {#each terms as term, listID}
                    <TermCard {term} listID={listID + 1} />
                {/each}
            </ol>
        {/if}
    </div>
</div>

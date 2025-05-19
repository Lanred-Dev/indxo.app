<script lang="ts">
    import EditableList from "$lib/components/Form/EditableList/EditableList.svelte";
    import type { Term } from "$lib/database/documents/Set";
    import determineWording from "$lib/utils/determineWording";
    import TermCard from "./TermCard.svelte";

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
                {#each terms as term, listID}
                    <TermCard {term} listID={listID + 1} />
                {/each}
            </ol>
        {/if}
    </div>
</div>

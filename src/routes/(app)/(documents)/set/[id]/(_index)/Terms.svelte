<script lang="ts">
    import EditableList from "$lib/components/Form/EditableList/EditableList.svelte";
    import type { Term } from "$lib/database/documents/Set";
    import type { SortingTerm } from "$lib/database/documents/User";
    import determineWording from "$lib/utils/determineWording";

    let { saved, terms }: { saved: SortingTerm[]; terms: Term[] } = $props();
</script>

<div class="list-primary mt-16">
    <p class="list-title">{determineWording("cards")}</p>

    <div class="list-primary">
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
    </div>
</div>

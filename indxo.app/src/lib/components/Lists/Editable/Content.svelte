<script lang="ts">
    import { getContext } from "svelte";
    import { editableListContextKey, type EditableListContext } from ".";
    import { EditableListItem } from ".";

    let editableList: EditableListContext = getContext(editableListContextKey);
</script>

<div class="list-primary">
    <ol class="list-container relative flex-col">
        {#each editableList.items as { index, _id, fields, isDraggable } (index)}
            <EditableListItem {index} {_id} bind:fields {isDraggable} />
        {/each}
    </ol>
</div>

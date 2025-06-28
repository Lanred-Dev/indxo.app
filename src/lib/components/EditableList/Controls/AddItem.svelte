<script lang="ts">
    import { getContext, type Snippet } from "svelte";
    import { editableListContextKey, type EditableListContext } from "..";
    import type { ClassValue } from "svelte/elements";

    let {
        class: className,
        children,
        ...properties
    }: { [key: string]: unknown; children: Snippet<[]>; class?: ClassValue } = $props();

    const editableList: EditableListContext = getContext(editableListContextKey);
</script>

<button
    class="button-attention w-full {className}"
    onclick={() => editableList.addItem()}
    type="button"
    {...properties}
>
    {@render children()}
</button>

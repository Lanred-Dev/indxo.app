<script lang="ts">
    import { getContext, onMount, type Snippet } from "svelte";
    import { type DialogContext, dialogContextKey } from ".";

    let {
        children,
        ...properties
    }: {
        children: Snippet<[]>;
        [key: string]: any;
    } = $props();

    const dialog: DialogContext = getContext(dialogContextKey);
</script>

<button
    type="button"
    onclick={() => {
        dialog.isVisible = !dialog.isVisible;
    }}
    {...properties}
>
    {@render children()}
</button>

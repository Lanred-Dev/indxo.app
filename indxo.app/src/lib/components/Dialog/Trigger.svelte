<script lang="ts">
    import { getContext, type Snippet } from "svelte";
    import { type DialogContext, dialogContextKey } from ".";

    let {
        children,
        onClick,
        ...properties
    }: {
        children: Snippet<[]>;
        onClick: () => void;
        [key: string]: any;
    } = $props();

    const dialog: DialogContext = getContext(dialogContextKey);
</script>

<button
    type="button"
    onclick={(event) => {
        event.stopPropagation();
        dialog.isVisible = !dialog.isVisible;
        onClick();
    }}
    {...properties}
>
    {@render children()}
</button>

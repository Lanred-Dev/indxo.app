<script lang="ts">
    import { getContext, type Snippet } from "svelte";
    import { type DialogContext, dialogContextKey } from ".";

    let {
        visible = $bindable(false),
        children,
        ...properties
    }: {
        visible?: boolean;
        children: Snippet<[]>;
        [key: string]: any;
    } = $props();

    const dialogContext: DialogContext = getContext(dialogContextKey);
</script>

<button onclick={() => dialogContext().setVisible(false)} {...properties}>
    {@render children()}
</button>

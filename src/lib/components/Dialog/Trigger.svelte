<script lang="ts">
    import { getContext, onMount, type Snippet } from "svelte";
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
    let trigger: HTMLButtonElement;
    onMount(() => dialogContext().setTrigger(trigger));
</script>

<button type="button" bind:this={trigger} {...properties}>
    {@render children()}
</button>

<script lang="ts">
    import { getContext, onMount, type Snippet } from "svelte";
    import { type PopupContext, popupContextKey } from ".";

    let {
        children,
        ...properties
    }: {
        children: Snippet<[]>;
        [key: string]: any;
    } = $props();

    const popup: PopupContext = getContext(popupContextKey);
</script>

<button type="button" aria-expanded={popup.isVisible} bind:this={popup.trigger} {...properties}>
    {@render children()}
</button>

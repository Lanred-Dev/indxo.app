<script lang="ts">
    import { getContext, onMount, type Snippet } from "svelte";
    import { type PopupContext, popupContextKey } from ".";

    let {
        visible = $bindable(false),
        children,
        ...properties
    }: {
        visible?: boolean;
        children: Snippet<[]>;
        [key: string]: any;
    } = $props();

    const popupContext: PopupContext = getContext(popupContextKey);
    let trigger: HTMLButtonElement;
    onMount(() => popupContext().setTrigger(trigger));
</script>

<button type="button" aria-expanded={popupContext().isVisible} bind:this={trigger} {...properties}>
    {@render children()}
</button>

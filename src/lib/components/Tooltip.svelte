<script lang="ts">
    import type { Snippet } from "svelte";
    import { Popup } from "./Popup";

    let {
        isVisible = $bindable(false),
        duration,
        children,
    }: { isVisible: boolean; duration: number; children: Snippet<[]> } = $props();

    let visibilityTimeout: number | null;

    $effect(() => {
        if (visibilityTimeout) {
            clearTimeout(visibilityTimeout);
            visibilityTimeout = null;
        }

        if (isVisible)
            visibilityTimeout = setTimeout(() => {
                isVisible = false;
            }, duration * 1000);
    });
</script>

<Popup bind:isVisible>
    {@render children()}
</Popup>

<script lang="ts">
    import type { Snippet } from "svelte";
    import Popup from "./Popup/Popup.svelte";

    let {
        isVisible = $bindable(false),
        duration,
        children,
    }: { isVisible: boolean; duration: number; children: Snippet<[]> } = $props();

    let visiblityTimeout: number | null;

    $effect(() => {
        if (visiblityTimeout) {
            clearTimeout(visiblityTimeout);
            visiblityTimeout = null;
        }

        if (isVisible)
            visiblityTimeout = setTimeout(() => {
                isVisible = false;
            }, duration * 1000);
    });
</script>

<Popup bind:isVisible>
    {@render children()}
</Popup>

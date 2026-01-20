<script lang="ts">
    import type { Snippet } from "svelte";
    import { Dialog } from "$lib/components/Dialog";

    let {
        children,
    }: {
        children: Snippet<[]>;
    } = $props();
</script>

<Dialog>
    {@render children()}
</Dialog>

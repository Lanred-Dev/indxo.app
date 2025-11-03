<script lang="ts">
    import type { Snippet } from "svelte";

    let {
        children,
    }: {
        children: Snippet<[]>;
    } = $props();
</script>

<div class="mb-12 last:mb-0">
    {@render children()}
</div>

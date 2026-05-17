<script lang="ts">
    import type { Snippet } from "svelte";

    let {
        children,
    }: {
        children: Snippet<[]>;
    } = $props();
</script>

<h2 class="mb-3 text-2xl leading-snug font-bold">
    {@render children()}
</h2>

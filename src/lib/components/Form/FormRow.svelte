<script lang="ts">
    import type { Snippet } from "svelte";

    let { children }: { children: Snippet<[]> } = $props();
</script>

<div class="flex-center w-full flex-wrap justify-between gap-5">
    {@render children?.()}
</div>

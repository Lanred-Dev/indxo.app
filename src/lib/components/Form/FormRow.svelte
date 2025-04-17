<script lang="ts">
    import type { Snippet } from "svelte";

    let { children }: { children: Snippet<[]> } = $props();
</script>

<div class="flex w-full flex-wrap items-center gap-5">
    {@render children?.()}
</div>

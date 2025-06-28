<script lang="ts">
    import { type Snippet } from "svelte";

    let { children, ...properties }: { [key: string]: unknown; children: Snippet<[]> } = $props();
</script>

<div class="flex-center sticky bottom-2 z-20 w-full pt-4" {...properties}>
    <div class="container-primary flex w-9/12 justify-between gap-2 p-2">
        {@render children()}
    </div>
</div>

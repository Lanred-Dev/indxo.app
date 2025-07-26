<script lang="ts">
    import type { ViewportContext } from "$lib/utils/global";
    import { getContext, onMount, type Snippet } from "svelte";

    let { children, ...properties }: { [key: string]: unknown; children: Snippet<[]> } = $props();

    const viewport: ViewportContext = getContext("viewport");
    let Controls: HTMLDivElement;
    let distanceToBottom: number = $state.raw(0);

    $effect(() => {
        viewport.scrollY;

        if (!Controls || !Controls.parentElement) return;

        const parentBounding = Controls.parentElement.getBoundingClientRect();
        const controlsBounding = Controls.getBoundingClientRect();
        distanceToBottom = Math.floor(
            Math.max(
                ((parentBounding.bottom - controlsBounding.bottom) / parentBounding.height) * 100,
                0
            )
        );
    });
</script>

<div class="flex-center sticky bottom-2 z-20 w-full pt-4" {...properties} bind:this={Controls}>
    <div
        class="container-primary flex justify-between gap-2 p-2 transition-[width] duration-300"
        style:width="{distanceToBottom < 25 ? 100 - distanceToBottom : 75}%"
    >
        {@render children()}
    </div>
</div>

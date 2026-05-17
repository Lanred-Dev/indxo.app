<script lang="ts">
    import type { ViewportContext } from "$lib/utils/global";
    import { getContext, type Snippet } from "svelte";

    let {
        children,
        startingWidth = 70,
        ...properties
    }: { startingWidth: number; [key: string]: unknown; children: Snippet<[]> } = $props();

    const viewport: ViewportContext = getContext("viewport");
    let Controls: HTMLUListElement;
    let width: number = $state.raw(0);

    $effect(() => {
        viewport.scrollY; // This forces a recalculation on scroll

        if (!Controls || !Controls.parentElement) return;

        const { bottom: parentBottom, height: parentHeight } =
            Controls.parentElement.getBoundingClientRect();
        const { bottom: controlsBottom } = Controls.getBoundingClientRect();
        const distanceToBottom: number = Math.min(
            100,
            Math.max(((parentBottom - controlsBottom) / parentHeight) * 100 - 2, 0) // Subtracting 2% ensures that the position does hit 100%, without it if there was no content below the list it can get stuck at 99% or 98% and never reach the bottom
        );
        width = distanceToBottom < 100 - startingWidth ? 100 - distanceToBottom : startingWidth;
    });
</script>

<ul class="flex-center sticky bottom-2 z-20 w-full pt-4" {...properties} bind:this={Controls}>
    <li class="flex flex-wrap justify-between gap-2 [&>button]:shadow-xl" style:width="{width}%">
        {@render children()}
    </li>
</ul>

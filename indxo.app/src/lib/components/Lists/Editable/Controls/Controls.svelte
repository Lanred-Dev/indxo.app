<script lang="ts">
    import type { ViewportContext } from "$lib/utils/global";
    import { getContext, type Snippet } from "svelte";

    let { children, ...properties }: { [key: string]: unknown; children: Snippet<[]> } = $props();

    const viewport: ViewportContext = getContext("viewport");
    let Controls: HTMLDivElement;
    let width: number = $state.raw(0);

    $effect(() => {
        // Force recalculation on scroll
        viewport.scrollY;

        if (!Controls || !Controls.parentElement) return;

        const { bottom: parentBottom, height: parentHeight } =
            Controls.parentElement.getBoundingClientRect();
        const { bottom: controlsBottom } = Controls.getBoundingClientRect();
        // Subtracting 2 ensures that the controls do hit 100%, without it if there was nothing below the list it would be 99%
        const distanceToBottom: number = Math.min(
            100,
            Math.max(((parentBottom - controlsBottom) / parentHeight) * 100 - 2, 0)
        );
        width = distanceToBottom < 25 ? 100 - distanceToBottom : 75;
    });
</script>

<div class="flex-center sticky bottom-2 z-20 w-full pt-4" {...properties} bind:this={Controls}>
    <div class="container-primary flex justify-between gap-2 p-2" style:width="{width}%">
        {@render children()}
    </div>
</div>

<script lang="ts">
    import type { ViewportContext } from "$lib/utils/global";
    import { getContext, type Snippet } from "svelte";

    let { children, ...properties }: { [key: string]: unknown; children: Snippet<[]> } = $props();

    const viewport: ViewportContext = getContext("viewport");
    let Controls: HTMLDivElement;
    let distanceToBottom: number = $state.raw(0);

    $effect(() => {
        viewport.scrollY;

        if (!Controls || !Controls.parentElement) return;

        const { bottom: parentBottom, height: parentHeight } =
            Controls.parentElement.getBoundingClientRect();
        const { bottom: controlsBottom } = Controls.getBoundingClientRect();
        distanceToBottom = Math.min(
            100,
            Math.ceil(Math.max(((parentBottom - controlsBottom) / parentHeight) * 100, 0))
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

<script lang="ts">
    import { getContext, onMount, tick, type Snippet } from "svelte";
    import type { ClassValue } from "svelte/elements";
    import { segmentedButtonGroupContextKey, type SegmentedButtonGroupContext } from ".";

    let {
        id,
        class: className,
        children,
        ...properties
    }: {
        id: string;
        class?: ClassValue;
        children: Snippet<[]>;
        [key: string]: unknown;
    } = $props();

    const segmentedButtonGroup: SegmentedButtonGroupContext = getContext(
        segmentedButtonGroupContextKey
    );
    let contentRect: DOMRect | undefined = $state.raw();

    onMount(() => {
        if (segmentedButtonGroup.value === "") segmentedButtonGroup.value = id;
    });

    $effect(() => {
        contentRect;

        if (segmentedButtonGroup.value !== id || !contentRect) return;

        segmentedButtonGroup.updateSelectorStyles();
    });
</script>

<li class="z-1 min-w-fit grow">
    <button
        class={["flex-center w-full gap-0.5 bg-transparent px-5 py-2", className]}
        {...properties}
        role="option"
        type="button"
        aria-selected={segmentedButtonGroup.value === id}
        onclick={() => (segmentedButtonGroup.value = id)}
        onmouseover={() => (segmentedButtonGroup.hovering = id)}
        onmouseout={() => (segmentedButtonGroup.hovering = null)}
        data-id={id}
        bind:contentRect
    >
        {@render children()}
    </button>
</li>

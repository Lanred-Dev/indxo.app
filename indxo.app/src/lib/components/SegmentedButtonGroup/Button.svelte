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
    let contentBounding: DOMRect | undefined = $state.raw();

    onMount(() => {
        // If this button is the first one in the group and no default value is set, select it
        if (segmentedButtonGroup.value.length === 0) segmentedButtonGroup.value = id;
    });

    $effect(() => {
        contentBounding;

        if (segmentedButtonGroup.value !== id || !contentBounding) return;

        segmentedButtonGroup.forceUpdateSelector();
    });
</script>

<li class={["z-1 min-w-fit grow", className]}>
    <button
        class={[
            "flex-center w-full gap-0.5 bg-transparent px-5 py-2",
            segmentedButtonGroup.hovering === id ? "text-primary" : "text-light",
        ]}
        {...properties}
        role="option"
        type="button"
        aria-selected={segmentedButtonGroup.value === id}
        onclick={() => (segmentedButtonGroup.value = id)}
        onmouseover={() => (segmentedButtonGroup.hovering = id)}
        onmouseout={() => (segmentedButtonGroup.hovering = null)}
        data-id={id}
        bind:contentRect={contentBounding}
    >
        {@render children()}
    </button>
</li>

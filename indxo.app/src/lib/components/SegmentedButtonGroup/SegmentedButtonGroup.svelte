<script lang="ts">
    import { onMount, setContext, type Snippet } from "svelte";
    import type { ClassValue } from "svelte/elements";
    import { segmentedButtonGroupContextKey, type SegmentedButtonGroupContext } from ".";

    let {
        value = $bindable(""),
        children,
        class: className,
        ...properties
    }: {
        value: string;
        children: Snippet<[]>;
        class?: ClassValue;
        [key: string]: unknown;
    } = $props();

    let Container: HTMLUListElement;
    let Selector: HTMLDivElement;
    let selectorWidth: number = $state.raw(0);
    let selectorHeight: number = $state.raw(0);
    let selectorLeft: number = $state.raw(0);
    let selectorTop: number = $state.raw(0);
    let selectorOpacity: number = $state.raw(100);
    let hovering: string | null = $state.raw(null);

    function moveSelectorTo(id: string | null) {
        const button: HTMLButtonElement | null = Container.querySelector(
            `button[data-id="${id ?? value}"]`
        );

        if (!button) return;

        const buttonBounding: DOMRect = button.getBoundingClientRect();
        const containerBounding: DOMRect = Container.getBoundingClientRect();
        selectorWidth = buttonBounding.width;
        selectorHeight = buttonBounding.height;
        selectorLeft = buttonBounding.left - containerBounding.left + Container.scrollLeft;
        selectorTop = buttonBounding.top - containerBounding.top + Container.scrollTop;
        selectorOpacity = id !== null && id !== value ? 50 : 100;
    }

    setContext(segmentedButtonGroupContextKey, {
        get value() {
            return value;
        },
        set value(newValue: string) {
            value = newValue;
            hovering = newValue;
            moveSelectorTo(newValue);
        },
        set hovering(newValue: string | null) {
            hovering = newValue === null ? value : newValue;
            moveSelectorTo(newValue);
        },
        get hovering() {
            return hovering;
        },
        // This method is used for when a buttons position or size changes while it's selected, so the selector can move to match it
        forceUpdateSelector: () => {
            moveSelectorTo(value);
        },
    } satisfies SegmentedButtonGroupContext);

    onMount(() => {
        if (value.length > 0) {
            hovering = value;
            moveSelectorTo(value);
        }
    });
</script>

<ul
    class={["rounded-input bg-light relative flex w-full flex-wrap overflow-hidden", className]}
    {...properties}
    bind:this={Container}
>
    <div
        bind:this={Selector}
        class="rounded-input bg-attention pointer-events-none absolute transition-all duration-200"
        style:width="{selectorWidth}px"
        style:height="{selectorHeight}px"
        style:left="{selectorLeft}px"
        style:top="{selectorTop}px"
        style:opacity="{selectorOpacity}%"
    ></div>

    {@render children()}
</ul>

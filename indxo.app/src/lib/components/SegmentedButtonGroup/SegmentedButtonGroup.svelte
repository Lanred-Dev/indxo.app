<script lang="ts">
    import { setContext, type Snippet } from "svelte";
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

    function moveSelectorTo(id: string | null) {
        const button: HTMLButtonElement | null = Container.querySelector(
            `button[data-id="${id ?? value}"]`
        );

        if (!button) return;

        const buttonRect: DOMRect = button.getBoundingClientRect();
        const containerRect: DOMRect = Container.getBoundingClientRect();
        selectorWidth = buttonRect.width;
        selectorHeight = buttonRect.height;
        selectorLeft = buttonRect.left - containerRect.left + Container.scrollLeft;
        selectorTop = buttonRect.top - containerRect.top + Container.scrollTop;
        selectorOpacity = id !== null && id !== value ? 50 : 100;
    }

    setContext(segmentedButtonGroupContextKey, {
        get value() {
            return value;
        },
        set value(newValue: string) {
            value = newValue;
            moveSelectorTo(newValue);
        },
        set hovering(newValue: string | null) {
            moveSelectorTo(newValue);
        },
        updateSelectorStyles: () => {
            moveSelectorTo(value);
        },
    } satisfies SegmentedButtonGroupContext);
</script>

<ul
    class={["rounded-input bg-light relative flex w-full flex-wrap overflow-hidden", className]}
    {...properties}
    bind:this={Container}
>
    <div
        bind:this={Selector}
        class="rounded-input bg-dark pointer-events-none absolute transition-all duration-200"
        style:width="{selectorWidth}px"
        style:height="{selectorHeight}px"
        style:left="{selectorLeft}px"
        style:top="{selectorTop}px"
        style:opacity="{selectorOpacity}%"
    ></div>

    {@render children()}
</ul>

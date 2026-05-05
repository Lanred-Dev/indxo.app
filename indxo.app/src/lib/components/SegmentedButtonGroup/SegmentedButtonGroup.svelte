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
    let hovering: string | null = $state.raw(null);

    function moveSelectorTo(id: string | null) {
        const button: HTMLButtonElement | null = Container.querySelector(
            `button[data-id="${id ?? value}"]`
        );

        if (!button) return;

        const buttonBounding: DOMRect = button.getBoundingClientRect();
        const containerBounding: DOMRect = Container.getBoundingClientRect();
        Selector.style.width = `${buttonBounding.width}px`;
        Selector.style.height = `${buttonBounding.height}px`;
        Selector.style.left = `${buttonBounding.left - containerBounding.left + Container.scrollLeft}px`;
        Selector.style.top = `${buttonBounding.top - containerBounding.top + Container.scrollTop}px`;
        Selector.style.backgroundColor =
            id !== null && id !== value
                ? "var(--background-color-dark)"
                : "var(--color-attention-light)";
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
        class="rounded-input bg-attention-light pointer-events-none absolute transition-all duration-200"
    ></div>

    {@render children()}
</ul>

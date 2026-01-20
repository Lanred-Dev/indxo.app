<script lang="ts">
    import type { ClassValue } from "svelte/elements";
    import Chevron, { ChevronState } from "./Icons/Chevron.svelte";

    let {
        value = $bindable(0),
        max = Infinity,
        min = -Infinity,
        class: className,
        ...properties
    }: {
        value?: number;
        max?: number;
        min?: number;
        class?: ClassValue;
        [key: string]: any;
    } = $props();

    function increment(increment: number) {
        value = Math.min(Math.max(value + increment, min), max);
    }
</script>

<div
    class={["input-primary flex-center gap-3", className]}
    role="spinbutton"
    tabindex="0"
    aria-valuenow={value}
    aria-valuemin={min}
    aria-valuemax={max}
    {...properties}
>
    <p>{value}</p>

    <div class="flex gap-x-2 md:flex-col">
        <button onclick={() => increment(1)} class="size-3">
            <Chevron state={ChevronState.up} class="h-full w-full scale-150" />
        </button>

        <button onclick={() => increment(-1)} class="size-3">
            <Chevron state={ChevronState.down} class="h-full w-full scale-150" />
        </button>
    </div>
</div>

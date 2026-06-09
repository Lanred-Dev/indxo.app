<script lang="ts">
    import { onMount } from "svelte";
    import type { ClassValue } from "svelte/elements";
    import Icon from "./Icon.svelte";

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

    let Input: HTMLInputElement;
    let lastValidValue: number = value;

    function increment(increment: number) {
        value = Math.min(Math.max(value + increment, min), max);
    }

    function onInput() {
        if (Input.value.length === 0) {
            value = min > 0 ? min : 0;
            lastValidValue = value;
            Input.value = "";
        } else {
            let newValue: number = parseInt(Input.value.replace(/[^0-9]/g, ""));

            if (!isNaN(newValue)) {
                lastValidValue = Math.min(Math.max(newValue, min), max);
                value = lastValidValue;
            }

            Input.value = lastValidValue.toString();
        }

        Input.size = Math.max(1, lastValidValue.toString().length);
    }

    onMount(() => onInput());
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
    <input
        bind:this={Input}
        bind:value
        type="text"
        inputmode="numeric"
        class="field-sizing-content w-[2ch] border-none bg-transparent p-0 outline-none focus:ring-0"
        onblur={onInput}
    />

    <div class="flex gap-x-2 md:flex-col">
        <button onclick={() => increment(1)} class="size-3">
            <Icon icon="general/Chevrons/Up" class="h-full w-full scale-150" />
        </button>

        <button onclick={() => increment(-1)} class="size-3">
            <Icon icon="general/Chevrons/Down" class="h-full w-full scale-150" />
        </button>
    </div>
</div>

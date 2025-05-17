<script module lang="ts">
    export function getCheckboxFormInputValue(inputContainer: HTMLElement): boolean {
        const checkbox: HTMLButtonElement = inputContainer.querySelector(
            ".CheckboxInput"
        ) as HTMLButtonElement;
        return checkbox.getAttribute("aria-checked") === "true";
    }
</script>

<script lang="ts">
    import determineTextWidth from "$lib/utils/determineTextWidth";
    import { onMount } from "svelte";

    let {
        labelID,
        states = {
            true: {
                icon: "/icons/general/Check.svg",
            },
            false: {
                icon: "/icons/general/X.svg",
            },
        },
        value: checkboxValue = $bindable(false),
    }: {
        labelID?: string;
        states?: {
            true: { text?: string; icon: string };
            false: { text?: string; icon: string };
        };
        value?: boolean;
    } = $props();

    let falseStateLength: number = $state(0);
    let trueStateLength: number = $state(0);

    onMount(async () => {
        falseStateLength = await determineTextWidth(states.false.text ?? "", "var(--text-lg)");
        trueStateLength = await determineTextWidth(states.true.text ?? "", "var(--text-lg)");
    });
</script>

<button
    class="CheckboxInput input-primary relative"
    onclick={() => (checkboxValue = !checkboxValue)}
    type="button"
    role="checkbox"
    aria-checked={checkboxValue}
    aria-labelledby={labelID}
>
    <img
        class="size-7"
        src={checkboxValue ? states.true.icon : states.false.icon}
        alt={checkboxValue ? states.true.text : states.false.text}
    />

    {#if states.true.text || states.false.text}
        <span
            class="text-left select-none"
            style:width="{Math.max(falseStateLength, trueStateLength)}px"
            >{checkboxValue ? states.true.text : states.false.text}</span
        >
    {/if}
</button>

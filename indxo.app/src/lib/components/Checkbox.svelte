<script lang="ts">
    import measureText from "$lib/utils/measureText";
    import { onMount } from "svelte";
    import Icon from "./Icon.svelte";

    let {
        states = {
            true: {
                icon: "general/Check",
            },
            false: {
                icon: "general/X",
            },
        },
        value = $bindable(false),
        ...properties
    }: {
        states?: {
            true: { text?: string; icon: string };
            false: { text?: string; icon: string };
        };
        value?: boolean;
        [key: string]: unknown;
    } = $props();

    let longestTextWidth: number = $state.raw(0);

    onMount(
        async () =>
            (longestTextWidth = Math.max(
                states.false.text
                    ? (await measureText(states.false.text, "var(--text-lg)")).width
                    : 0,
                states.true.text ? (await measureText(states.true.text, "var(--text-lg)")).width : 0
            ))
    );
</script>

<button
    class="input-primary relative"
    onclick={() => (value = !value)}
    type="button"
    role="checkbox"
    aria-checked={value}
    {...properties}
>
    <Icon icon={value ? states.true.icon : states.false.icon} />

    {#if states.true.text || states.false.text}
        <span class="text-left select-none" style:width="{longestTextWidth}px"
            >{value ? states.true.text : states.false.text}</span
        >
    {/if}
</button>

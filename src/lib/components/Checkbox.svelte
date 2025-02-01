<script lang="ts">
    import CheckIcon from "$lib/icons/Check.svelte";
    import XIcon from "$lib/icons/X.svelte";
    import { twMerge } from "tailwind-merge";

    let {
        placeholder,
        classes,
        id,
    }: {
        placeholder?: boolean;
        classes?: string;
        id?: string;
    } = $props();

    let currentValue: boolean = $state(placeholder || false);
</script>

<div class={twMerge("checkbox relative", classes)} {id} data-value={currentValue}>
    <button onclick={() => (currentValue = !currentValue)} data-input type="button">
        {#if currentValue}
            <CheckIcon classes="aspect-1 h-7" />
        {:else}
            <XIcon classes="aspect-1 h-7" />
        {/if}
    </button>
</div>

<script lang="ts">
    import CheckIcon from "$lib/icons/Check.svelte";
    import XIcon from "$lib/icons/X.svelte";
    import { twMerge } from "tailwind-merge";

    let {
        placeholder,
        classes,
    }: {
        placeholder?: boolean;
        classes?: string;
    } = $props();

    let currentValue: boolean = $state(placeholder || false);
</script>

<div class={twMerge("checkbox relative", classes)} data-value={currentValue}>
    <button onclick={() => (currentValue = !currentValue)} data-input type="button" class="!p-2">
        {#if currentValue}
            <CheckIcon fill="#000000" classes="aspect-1 h-7" />
        {:else}
            <XIcon fill="#000000" classes="aspect-1 h-7" />
        {/if}
    </button>
</div>

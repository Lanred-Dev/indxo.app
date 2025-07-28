<script lang="ts">
    import type { ClassValue } from "svelte/elements";

    let {
        value = $bindable(),
        multiline = false,
        maxlength = Infinity,
        class: className,
        ...properties
    }: {
        value?: string;
        multiline?: boolean;
        maxlength?: number;
        class?: ClassValue;
        [key: string]: any;
    } = $props();

    let attributes = $derived({
        class: [
            `input-primary field-sizing-content resize-none w-full`,
            multiline && "min-h-40 h-auto break-all",
            className,
        ],
        maxlength,
        "data-max": value?.length === maxlength ? true : undefined,
        ...properties,
    });
</script>

{#if multiline}
    <textarea bind:value {...attributes}></textarea>
{:else}
    <input bind:value {...attributes} />
{/if}

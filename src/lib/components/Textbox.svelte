<script lang="ts">
    let {
        value = $bindable(""),
        multiline = false,
        maxlength = Infinity,
        ...properties
    }: {
        value?: string;
        multiline?: boolean;
        maxlength?: number;
        [key: string]: any;
    } = $props();

    let attributes = $derived({
        class: ["input-primary field-sizing-content resize-none w-full", multiline && "h-40"],
        maxlength,
        "data-max": value.length === maxlength ? true : undefined,
        ...properties,
    });
</script>

{#if multiline}
    <textarea bind:value {...attributes}></textarea>
{:else}
    <input bind:value {...attributes} />
{/if}

<script lang="ts">
    import { twMerge } from "tailwind-merge";

    let {
        classes,
        text,
        icons = ["/icons/general/Check.svg", "/icons/general/X.svg"],
        value = $bindable(false),
    }: {
        classes?: string;
        icons?: [string, string];
        text?: [string, string];
        value?: boolean;
    } = $props();
</script>

<div class={twMerge("checkbox relative", classes)} data-value={value}>
    <button class="input-primary" onclick={() => (value = !value)} type="button">
        <img class="size-7" src={value ? icons[0] : icons[1]} alt={value ? "True" : "False"} />

        {#if text}
            <span class="select-none">{value ? text[0] : text[1]}</span>
        {/if}
    </button>
</div>

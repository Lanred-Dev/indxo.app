<script lang="ts">
    import { twMerge } from "tailwind-merge";

    let {
        classes,
        text,
        icons = ["/icons/general/Check.svg", "/icons/general/X.svg"],
        value: checkboxValue = $bindable(false),
    }: {
        classes?: string;
        icons?: [string, string];
        text?: [string, string];
        value?: boolean;
    } = $props();
</script>

<div class={twMerge("checkbox relative", classes)} data-value={checkboxValue}>
    <button class="input-primary" onclick={() => (checkboxValue = !checkboxValue)} type="button">
        <img
            class="size-7"
            src={checkboxValue ? icons[0] : icons[1]}
            alt={checkboxValue ? "True" : "False"}
        />

        {#if text}
            <span class="select-none">{checkboxValue ? text[0] : text[1]}</span>
        {/if}
    </button>
</div>

<script module lang="ts">
    export function GetFormInputValue(inputContainer: HTMLElement): boolean {
        const checkbox: HTMLButtonElement = inputContainer.querySelector(
            ".CheckboxInput"
        ) as HTMLButtonElement;
        return checkbox.getAttribute("aria-checked") === "true";
    }
</script>

<script lang="ts">
    let {
        labelID,
        text,
        icons = ["/icons/general/Check.svg", "/icons/general/X.svg"],
        value: checkboxValue = $bindable(false),
    }: {
        labelID?: string;
        icons?: [string, string];
        text?: [string, string];
        value?: boolean;
    } = $props();
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
        src={checkboxValue ? icons[0] : icons[1]}
        alt={checkboxValue ? "True" : "False"}
    />

    {#if text}
        <span class="select-none">{checkboxValue ? text[0] : text[1]}</span>
    {/if}
</button>

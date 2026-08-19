<script lang="ts" module>
    export enum SettingInputType {
        string = "string",
        number = "number",
        boolean = "boolean",
    }
</script>

<script lang="ts">
    import Textbox from "$lib/components/Textbox.svelte";
    import Checkbox from "$lib/components/Checkbox.svelte";
    import NumberInput from "$lib/components/NumberInput.svelte";

    let {
        value = $bindable(),
        type,
        placeholder,
        properties = {},
    }: {
        value: any;
        type: SettingInputType;
        placeholder?: any;
        properties?: { [key: string]: any };
    } = $props();

    if (value === undefined && placeholder !== undefined) {
        value = placeholder;
    }
</script>

<div>
    {#if type === SettingInputType.number}
        <NumberInput bind:value class="w-fit! min-w-fit" {...properties} />
    {:else if type === SettingInputType.boolean}
        <Checkbox bind:value {placeholder} label={placeholder} {...properties} />
    {:else if type === SettingInputType.string}
        <Textbox bind:value {placeholder} class="w-fit! min-w-fit" {...properties} />
    {/if}
</div>

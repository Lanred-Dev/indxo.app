<script lang="ts" module>
    export enum SettingInputType {
        string = "string",
        number = "number",
        boolean = "boolean",
    }
</script>

<script lang="ts">
    import Textbox from "$lib/components/Textbox.svelte";
    import { getContext } from "svelte";
    import type { SettingsPageContext } from "../+page.svelte";
    import { invalidateAll } from "$app/navigation";
    import Checkbox from "$lib/components/Checkbox.svelte";
    import { fade } from "svelte/transition";
    import NumberInput from "$lib/components/NumberInput.svelte";

    let {
        value = $bindable(),
        type,
        placeholder,
        updateEndpoint = {
            url: "",
            id: "",
            method: "PUT",
        },
        updateText = "Save",
        onUpdate = async () => {
            const response = await fetch(updateEndpoint.url, {
                method: updateEndpoint.method,
                body: JSON.stringify({ [updateEndpoint.id]: value }),
            });

            return response.ok;
        },
        properties = {},
    }: {
        value: any;
        type: SettingInputType;
        placeholder?: any;
        updateEndpoint?: {
            url: string;
            id: string;
            method: string;
        };
        updateText?: string;
        onUpdate?: (value: any) => Promise<boolean>;
        properties?: { [key: string]: any };
    } = $props();

    const settingsPage: SettingsPageContext = getContext("settingsPage");

    if (value === undefined && placeholder !== undefined) {
        value = placeholder;
    }

    let savedValue: any = $state.raw(value);
</script>

<div>
    <div class="flex w-fit flex-row-reverse flex-wrap items-start justify-start gap-2 md:flex-row">
        {#if value !== savedValue}
            <button
                class="button-primary"
                onclick={async () => {
                    savedValue = value;

                    const wasSuccessful: boolean = await onUpdate(value);

                    if (wasSuccessful) invalidateAll();

                    settingsPage.showSubmitMessage(!wasSuccessful);
                }}
                in:fade={{ duration: 200 }}
            >
                {updateText}
            </button>
        {/if}

        {#if type === SettingInputType.number}
            <NumberInput bind:value class="w-fit! min-w-fit" {...properties} />
        {:else if type === SettingInputType.boolean}
            <Checkbox bind:value {placeholder} label={placeholder} {...properties} />
        {:else if type === SettingInputType.string}
            <Textbox bind:value {placeholder} class="w-fit! min-w-fit" {...properties} />
        {/if}
    </div>
</div>

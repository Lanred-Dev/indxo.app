<script lang="ts">
    import Textbox from "$lib/components/Textbox.svelte";
    import { getContext } from "svelte";
    import type { SettingsPageContext } from "../+page.svelte";
    import { invalidateAll } from "$app/navigation";
    import Checkbox from "$lib/components/Checkbox.svelte";
    import { fade } from "svelte/transition";

    let {
        value,
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
    }: {
        value: string | number | boolean;
        placeholder?: any;
        updateEndpoint?: {
            url: string;
            id: string;
            method: string;
        };
        updateText?: string;
        onUpdate?: (value: any) => Promise<boolean>;
    } = $props();

    const settingsPage: SettingsPageContext = getContext("settingsPage");
    let savedValue: any = $state.raw(value);
</script>

<div class="flex flex-wrap gap-2">
    {#if typeof value === "number"}
        <input bind:value {placeholder} type="number" class="input-primary w-fit min-w-fit" />
    {:else if typeof value === "boolean"}
        <Checkbox bind:value {placeholder} label={placeholder} />
    {:else if typeof value === "string"}
        <Textbox bind:value {placeholder} class="w-fit! min-w-fit" />
    {/if}

    {#if value !== savedValue}
        <button
            class="button-primary"
            onclick={async () => {
                savedValue = value;

                const wasSuccessful: boolean = await onUpdate(value);

                if (!wasSuccessful) {
                    settingsPage.showSubmitErrorMessage();
                } else {
                    invalidateAll();
                }
            }}
            in:fade={{ duration: 200 }}
        >
            {updateText}
        </button>
    {/if}
</div>

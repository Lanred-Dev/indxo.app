<script lang="ts">
    import Textbox from "$lib/components/Textbox.svelte";
    import { getContext } from "svelte";
    import type { SettingsPageContext } from "../+page.svelte";
    import { invalidateAll } from "$app/navigation";

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
        value: string | number;
        placeholder?: string;
        updateEndpoint?: {
            url: string;
            id: string;
            method: string;
        };
        updateText?: string;
        onUpdate?: (value: any) => Promise<boolean>;
    } = $props();

    const settingsPage: SettingsPageContext = getContext("settingsPage");
    let savedValue: any = value;
</script>

<div class="flex flex-wrap gap-2">
    {#if typeof value === "number"}
        <input bind:value {placeholder} type="number" class="input-primary w-fit min-w-fit" />
    {:else}
        <Textbox bind:value {placeholder} class="w-fit! min-w-fit" />
    {/if}

    <button
        class="button-primary"
        onclick={async () => {
            if (value === savedValue) return;

            savedValue = value;

            const wasSuccessful: boolean = await onUpdate(value);

            if (!wasSuccessful) {
                settingsPage.showSubmitErrorMessage();
            } else {
                invalidateAll();
            }
        }}
    >
        {updateText}
    </button>
</div>

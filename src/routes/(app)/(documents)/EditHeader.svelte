<script lang="ts">
    import FormSubmit from "$lib/components/Form/FormSubmit.svelte";
    import type { PublicFolder } from "$lib/database/documents/Folder";
    import type { PublicSet } from "$lib/database/documents/Set";
    import determineWording from "$lib/utils/determineWording";
    import { onMount } from "svelte";
    import { formatDistanceToNow } from "date-fns";

    let {
        updated,
        type,
        document,
    }: {
        updated: number | null;
        type: "set" | "folder";
        document: PublicSet | PublicFolder;
    } = $props();

    let text: string = $state.raw("");

    function updateText() {
        if (typeof updated !== "number") return;

        text = formatDistanceToNow(updated, {
            addSuffix: true,
        });
    }

    $effect(() => {
        if (typeof updated !== "number") return;

        updateText();
        const updateTextInterval = setInterval(updateText, 5000);
        return clearInterval(updateTextInterval);
    });
</script>

<svelte:head>
    <title>Edit {document.name}</title>
</svelte:head>

<div class="w-full">
    <div class="relative w-full">
        <p class="md:x-center md:y-center mb-5 text-center text-2xl md:mb-0">{document.name}</p>

        <div class="flex w-full flex-wrap items-center justify-between gap-x-12 gap-y-5">
            <a class="button-basic" href="/{type}/{document._id}">
                <img src="/icons/general/LeftChevron.svg" alt="Back" />
                Back to {determineWording(type)}
            </a>

            <div class="flex-center gap-3">
                <FormSubmit text="Update" />
            </div>
        </div>
    </div>

    {#if text.length > 0}
        <p class="text-light mt-1 w-full text-right text-nowrap">Last updated {text}</p>
    {/if}
</div>

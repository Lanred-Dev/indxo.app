<script lang="ts">
    import { DocumentType, type PublicFolder, type PublicSet } from "$lib/documents";
    import determineDocumentType from "$lib/utils/document/determineType";
    import { Wording } from "$lib/utils/wording";
    import { formatDistanceToNow } from "date-fns";

    let {
        updated,
        document,
    }: {
        updated: number | null;
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
    <title>Editing {document.name}</title>
</svelte:head>

<div class="w-full">
    <div class="relative w-full">
        <p class="md:x-center md:y-center mb-5 text-center text-2xl font-medium md:mb-0">
            {document.name}
        </p>

        <div class="flex w-full flex-wrap items-center justify-between gap-x-12 gap-y-5">
            <a class="button-basic" href="/{document._id}">
                <img src="/icons/general/LeftChevron.svg" alt="Back" />
                Back to {Wording[
                    determineDocumentType(document._id) === DocumentType.folder ? "folder" : "set"
                ]}
            </a>

            <div class="flex-center gap-3"></div>
        </div>
    </div>

    {#if text.length > 0}
        <p class="text-light mt-1 w-full text-right text-nowrap">Last updated {text}</p>
    {/if}
</div>

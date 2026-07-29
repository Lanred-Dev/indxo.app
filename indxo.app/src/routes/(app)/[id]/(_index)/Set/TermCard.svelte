<script lang="ts">
    import { ExpandableImage } from "$lib/components/Image";
    import MarkdownText from "$lib/components/MarkdownText.svelte";
    import type { Term } from "$lib/documents";

    let {
        term,
        definition,
        frontImage,
        backImage,
        timesMissed = 0,
        isStrugglingTerm = false,
        index,
    }: Term & { timesMissed?: number; index: number; isStrugglingTerm?: boolean } = $props();
</script>

<li
    class={[
        "container-primary flex flex-col gap-y-1",
        timesMissed > 0 && isStrugglingTerm && "border-alert shadow-alert shadow/40",
        timesMissed > 0 && !isStrugglingTerm && "border-warning shadow-warning shadow/40",
    ]}
>
    <div class="flex flex-wrap justify-between gap-x-3 gap-y-1">
        <p class="text-lg font-semibold">#{index + 1}</p>

        {#if timesMissed > 0}
            <p class="text-base">You've missed this term {timesMissed} times</p>
        {/if}
    </div>

    <div class="flex gap-x-3 gap-y-1">
        <MarkdownText text={term} />

        {#if frontImage}
            <ExpandableImage src={frontImage} alt="Front Image" class="h-30 w-auto" />
        {/if}
    </div>

    <div class="flex gap-x-3 gap-y-1">
        <MarkdownText text={definition} />

        {#if backImage}
            <ExpandableImage src={backImage} alt="Back Image" class="h-30 w-auto" />
        {/if}
    </div>
</li>

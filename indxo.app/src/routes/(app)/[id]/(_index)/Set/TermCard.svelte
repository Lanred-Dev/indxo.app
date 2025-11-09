<script lang="ts">
    import { ExpandableImage } from "$lib/components/Image";
    import MarkdownText from "$lib/components/MarkdownText.svelte";
    import type { Term } from "$lib/documents";

    let {
        term,
        definition,
        image,
        timesMissed = 0,
        isStrugglingTerm = false,
        index,
    }: Term & { timesMissed?: number; index: number; isStrugglingTerm?: boolean } = $props();
</script>

<li
    class={[
        "container-primary flex gap-3",
        timesMissed > 0 && isStrugglingTerm && "border-alert shadow-alert shadow/40",
        timesMissed > 0 && !isStrugglingTerm && "border-warning shadow-warning shadow/40",
    ]}
>
    <p class="text-lg font-semibold">#{index + 1}</p>

    <div class="break-word w-full space-y-2 text-xl">
        <div class="flex w-full justify-between gap-3">
            <MarkdownText class="" text={term} />

            {#if timesMissed > 0}
                <p class="text-base">missed {timesMissed} times</p>
            {/if}
        </div>

        <MarkdownText class="leading-none" text={definition} />

        {#if image}
            <ExpandableImage src={image} alt="Term Image" class="h-30 w-auto" />
        {/if}
    </div>
</li>

<script lang="ts">
    import { ExpandableImage } from "$lib/components/Image";
    import MarkdownText from "$lib/components/MarkdownText.svelte";
    import type { Term } from "$lib/documents";

    let {
        term,
        definition,
        image,
        missed = 0,
        index,
    }: Term & { missed?: number; index: number } = $props();
</script>

<li class={["container-primary flex gap-3", missed > 0 && "border-alert shadow-alert shadow/40"]}>
    <p class="text-lg font-semibold">#{index + 1}</p>

    <div class="break-word w-full space-y-2 text-xl">
        <div class="flex w-full justify-between gap-3">
            <MarkdownText class="" text={term} />

            {#if missed > 0}
                <p>missed {missed} times</p>
            {/if}
        </div>

        <MarkdownText class="leading-none" text={definition} />

        {#if image}
            <ExpandableImage src={image} alt="Term Image" class="h-30 w-auto" />
        {/if}
    </div>
</li>

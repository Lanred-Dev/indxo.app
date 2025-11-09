<script lang="ts">
    import { getContext } from "svelte";
    import type { DocumentContext } from "../../+page.svelte";

    let {
        knowTerms,
        stillLearningTerms,
        strugglingTerms,
    }: {
        knowTerms: number;
        stillLearningTerms: number;
        strugglingTerms: number;
    } = $props();

    const document: DocumentContext = getContext("document");
</script>

<div class="flex-center mb-5 w-full gap-5 text-lg font-semibold">
    <p class="text-warning">{stillLearningTerms}</p>

    <div class="bg-input flex h-2 w-3/4 overflow-hidden rounded-full">
        <div
            class="bg-warning progress-bar"
            style:width="{(stillLearningTerms / document.terms.length) * 100}%"
        >
            <div
                class="progress-bar bg-alert"
                style:width="{(strugglingTerms / stillLearningTerms) * 100}%"
            ></div>
        </div>

        <div
            class="bg-success progress-bar"
            style:width="{(knowTerms / document.terms.length) * 100}%"
        ></div>
    </div>

    <p class="text-success">{knowTerms}</p>
</div>

<style lang="postcss">
    .progress-bar {
        @apply h-full transition-[width] duration-200;
    }
</style>

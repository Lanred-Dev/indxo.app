<script lang="ts">
    let {
        knowTerms,
        stillLearningTerms,
        strugglingTerms,
        terms,
    }: {
        knowTerms: number;
        stillLearningTerms: number;
        strugglingTerms: number;
        terms: number;
    } = $props();
</script>

<div class="flex-center mb-5 w-full gap-2">
    <div class="bg-input flex h-2 w-3/4 overflow-hidden rounded-full">
        <div class="bg-alert progress-bar" style:width="{(stillLearningTerms / terms) * 100}%">
            <div
                class="progress-bar bg-amber-400"
                style:width="{(strugglingTerms / terms) * 100}%"
            ></div>
        </div>

        <div class="bg-success progress-bar" style:width="{(knowTerms / terms) * 100}%"></div>
    </div>
</div>

<style lang="postcss">
    .progress-bar {
        @apply h-full transition-[width] duration-200;
    }
</style>

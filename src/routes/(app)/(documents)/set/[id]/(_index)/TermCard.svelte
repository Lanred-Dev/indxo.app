<script lang="ts">
    import type { Term } from "$lib/database/documents/Set";

    let { term, missed = 0, listID }: { term: Term; missed?: number; listID: number } = $props();
</script>

<li class="container-primary flex gap-3 {missed > 0 ? 'border-alert shadow-alert shadow/40' : ''}">
    <p class="text-lg font-bold">#{listID}</p>

    <div class="w-full">
        <div class="flex w-full justify-between gap-3">
            <p class="break-word text-lg font-bold">{term.term}</p>

            {#if missed > 0}
                <p>missed {missed} times</p>
            {/if}
        </div>

        <p class="break-word mt-0.5 text-lg leading-none">{term.definition}</p>
    </div>
</li>

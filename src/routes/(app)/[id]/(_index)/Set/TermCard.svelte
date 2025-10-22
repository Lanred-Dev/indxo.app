<script lang="ts">
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

    <div class="w-full">
        <div class="flex w-full justify-between gap-3">
            <p class="break-word text-lg font-black">{term}</p>

            {#if missed > 0}
                <p>missed {missed} times</p>
            {/if}
        </div>

        <p class="break-word mt-0.5 text-lg leading-none">{definition}</p>
    </div>
</li>

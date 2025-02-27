<script lang="ts">
    import SetCard from "$lib/components/Cards/Set.svelte";

    let { data } = $props();
</script>

<h1 class="flex flex-col gap-4 pl-3">
    <span class="text-5xl font-bold">All of your</span>
    <span class="font-Quetine pl-44 text-7xl">sets</span>
</h1>

<div class="mt-16 flex w-full flex-wrap gap-2">
    {#each data.sets as set}
        <SetCard {...set} />
    {/each}
</div>

<script lang="ts">
    import SetCard from "$lib/components/Cards/Set.svelte";

    let { data } = $props();
</script>

<h1 class="pl-3 text-3xl font-bold">All of your sets</h1>

<div class="mt-2 flex w-full flex-wrap gap-2">
    {#each data.sets as set}
        <SetCard {...set} />
    {/each}
</div>

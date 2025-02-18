<script lang="ts">
    import Set from "./Card.svelte";

    let { data } = $props();
</script>

<h1 class="text-5xl font-bold">All of your sets</h1>

<div class="flex w-full flex-wrap gap-2">
    {#each data.sets as set}
        <Set {...set} />
    {/each}
</div>

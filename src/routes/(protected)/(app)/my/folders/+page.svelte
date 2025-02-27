<script lang="ts">
    import FolderCard from "$lib/components/Cards/Folder.svelte";

    let { data } = $props();
</script>

<h1 class="flex flex-col gap-4 pl-3">
    <span class="text-5xl font-bold">All of your</span>
    <span class="font-Quetine pl-44 text-7xl">folders</span>
</h1>

<div class="mt-2 flex w-full flex-wrap gap-2">
    {#each data.folders as folder}
        <FolderCard {...folder} />
    {/each}
</div>

<script lang="ts">
    import FolderCard from "$lib/components/Cards/Folder.svelte";

    let { data } = $props();
</script>

<h1 class="pl-3 text-3xl font-bold">All of your folders</h1>

<div class="mt-2 flex w-full flex-wrap gap-2">
    {#each data.folders as folder}
        <FolderCard {...folder} />
    {/each}
</div>

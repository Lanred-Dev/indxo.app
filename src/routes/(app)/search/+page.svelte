<script lang="ts">
    import determineWording from "$lib/utils/determineWording";

    let { data } = $props();
</script>

<svelte:head>
    <title>Results for "{data.query}"</title>
</svelte:head>

<div class="mb-12">
    <p class="page-subtitle">Searching in {data.returnOnly}</p>
    <h1 class="page-title">Results for "{data.query}"</h1>
</div>

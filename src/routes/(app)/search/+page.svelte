<script lang="ts">
    import CardGroup from "$lib/components/CardGroup.svelte";
    import determineWording from "$lib/utils/determineWording";

    let { data } = $props();
</script>

<svelte:head>
    <title>Results for "{data.query}"</title>
</svelte:head>

<div class="page-title">
    <p class="page-subtitle">Searching in {data.returnOnly}</p>
    <h1 class="page-title">Results for "{data.query}"</h1>
</div>

<div>
    <CardGroup documents={data.results as any}></CardGroup>
</div>

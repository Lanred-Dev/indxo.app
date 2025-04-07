<script lang="ts">
    import determineWording from "$lib/utils/determineWording";

    let { data } = $props();
</script>

<svelte:head>
    <title>Results for "{data.query}"</title>
</svelte:head>

<div class="page-title">
    <p>Searching in {data.returnOnly}</p>
    <h1>Results for "{data.query}"</h1>
</div>

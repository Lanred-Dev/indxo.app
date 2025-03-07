<script lang="ts">
    import determineWording from "$lib/utils/determineWording";

    let { data } = $props();
</script>

<svelte:head>
    <title>Results for "{data.query}"</title>
</svelte:head>

<div>
    <p class="text-light text-xl leading-tight">
        Searching in {typeof data.returnOnly === "string"
            ? determineWording(data.returnOnly)
            : "all"}
    </p>
    <h1 class="text-5xl font-bold leading-none">Results for "{data.query}"</h1>
</div>

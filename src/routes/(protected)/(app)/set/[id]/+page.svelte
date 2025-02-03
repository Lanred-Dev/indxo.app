<script lang="ts">
    let { data } = $props();
</script>

<svelte:head>
    <title>{data.name} by {data.ownerWithData.name}</title>
</svelte:head>

<div class="flex gap-0.5">
    <img
        src={data.ownerWithData.image}
        alt={data.ownerWithData.name}
        class="aspect-1 h-7 flex-shrink-0"
    />
    <p></p>
</div>

<h1>{data.name}</h1>

<script lang="ts">
    import Header from "./Header.svelte";

    let { data } = $props();
</script>

<svelte:head>
    <title>{data.name}</title>
    <meta property="og:title" content={data.name} />
</svelte:head>

<Header name={data.name} image={data.image} />

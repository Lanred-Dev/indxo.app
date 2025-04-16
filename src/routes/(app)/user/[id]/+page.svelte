<script lang="ts">
    import Header from "./Header.svelte";

    let { data } = $props();
</script>

<Header name={data.name} image={data.image} />

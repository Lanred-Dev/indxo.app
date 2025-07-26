<script lang="ts">
    let {
        ...properties
    }: {
        [key: string]: any;
    } = $props();
</script>

<img {...properties} />

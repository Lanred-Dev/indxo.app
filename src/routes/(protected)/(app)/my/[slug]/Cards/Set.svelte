<script lang="ts">
    import type { PublicSet } from "$lib/database/documents/Set";

    let { name }: PublicSet = $props();
</script>

<p>{name}</p>

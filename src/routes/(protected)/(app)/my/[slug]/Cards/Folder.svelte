<script lang="ts">
    import type { PublicFolder } from "$lib/database/documents/Folder";

    let { name }: PublicFolder = $props();
</script>

<p>{name}</p>

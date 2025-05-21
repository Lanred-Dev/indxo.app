<script lang="ts">
    import type { PublicUser } from "$lib/database/documents/User";

    let { name, image }: PublicUser = $props();
</script>

<div class="flex items-center gap-3">
    <img src={image} alt={name} class="size-16 rounded-full" />

    <div>
        <h1 class="page-title">{name}</h1>
    </div>
</div>

<script lang="ts">
    import type { PublicFolder } from "$lib/database/documents/Folder";
    import User from "../../../User.svelte";

    let { description, owner, created }: PublicFolder = $props();
</script>

<div class="mt-2 mb-12 space-y-8">
    <p class="text-lg">{description}</p>

    <User {owner} {created} />
</div>

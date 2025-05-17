<script lang="ts">
    import type { PublicSet } from "$lib/database/documents/Set";
    import User from "../../../User.svelte";

    let { description, owner, created }: PublicSet = $props();
</script>

<div class="mt-20 space-y-6">
    <User {owner} {created} />

    <p class="text-lg break-all hyphens-auto">{description}</p>
</div>

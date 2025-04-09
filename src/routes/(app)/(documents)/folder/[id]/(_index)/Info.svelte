<script lang="ts">
    import type { PublicFolder } from "$lib/database/documents/Folder";
    import Account from "../../../Account.svelte";

    let { description, owner, created }: PublicFolder = $props();
</script>

<div class="mb-12 space-y-6">
    <Account {owner} {created} />

    <p class="text-lg">{description}</p>
</div>

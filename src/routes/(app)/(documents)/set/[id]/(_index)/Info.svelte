<script lang="ts">
    import type { PublicSet } from "$lib/database/documents/Set";
    import Account from "../../../Account.svelte";

    let { description, owner, created }: PublicSet = $props();
</script>

<div class="mb-12 mt-20 space-y-6">
    <Account {owner} {created} />

    <p class="text-lg">{description}</p>
</div>

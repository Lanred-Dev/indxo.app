<script lang="ts">
    import type { SimpleUser } from "$lib/database/documents/User";
    import { formatDistanceToNow } from "date-fns";

    let { owner, created }: { owner: SimpleUser; created: number } = $props();
</script>

<a class="flex gap-2" href="/user/{owner._id}">
    <img src={owner.image} alt={owner.name} class="border-primary size-11 rounded-full border" />

    <div class="text-sm">
        <p class="text-dark leading-snug">Created by</p>
        <p class="text-lg leading-tight font-semibold">{owner.name}</p>
        <p class="text-light leading-none font-medium">
            {formatDistanceToNow(created ?? Date.now(), {
                includeSeconds: true,
                addSuffix: true,
            })}
        </p>
    </div>
</a>

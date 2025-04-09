<script lang="ts">
    import type { SimpleUser } from "$lib/database/documents/User";
    import { formatDistanceToNow } from "date-fns";

    let { owner, created }: { owner: SimpleUser; created: number } = $props();
</script>

<a class="flex gap-2" href="/account/{owner._id}">
    <img src={owner.image} alt={owner.name} class="size-11 rounded-full border border-primary" />

    <div class="[&>p]:leading-tight">
        <p class="text-dark text-sm leading-snug">Created by</p>
        <p class="text-lg font-bold">{owner.name}</p>
        <p class="text-light text-sm">
            {formatDistanceToNow(created ?? Date.now(), {
                includeSeconds: true,
                addSuffix: true,
            })}
        </p>
    </div>
</a>

<script lang="ts">
    import type { PublicSet } from "$lib/database/documents/Set";
    import { formatDistanceToNow } from "date-fns";

    let { description, owner, created }: PublicSet = $props();
</script>

<div class="space-y-6">
    <p class="text-lg">{description}</p>

    <a class="flex gap-2" href="/account/{owner?._id}">
        <img
            src={owner?.image}
            alt={owner?.name}
            class="size-11 rounded-full border border-primary"
        />

        <div class="[&>p]:leading-tight">
            <p class="text-dark text-sm leading-snug">Created by</p>
            <p class="text-lg font-bold">{owner?.name}</p>
            <p class="text-light text-sm">
                {formatDistanceToNow(created || new Date(), {
                    includeSeconds: true,
                    addSuffix: true,
                })}
            </p>
        </div>
    </a>
</div>

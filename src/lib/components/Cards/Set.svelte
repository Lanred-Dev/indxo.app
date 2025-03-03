<script lang="ts">
    import type { PublicSet } from "$lib/database/documents/Set";

    let { _id, name, subject, description }: PublicSet = $props();
</script>

<div class="primary inline-block w-full border border-primary">
    <a
        class="flex h-full w-full flex-col justify-between gap-4 overflow-hidden px-8 py-6 [&>p]:leading-tight"
        href="/set/{_id}"
    >
        <div class="w-full">
            <p class="w-full overflow-hidden overflow-ellipsis text-xl font-bold">{name}</p>
            <p class="text-dark text-sm">{subject}</p>
        </div>

        <p class="text-light line-clamp-1 overflow-hidden overflow-ellipsis">{description}</p>
    </a>
</div>

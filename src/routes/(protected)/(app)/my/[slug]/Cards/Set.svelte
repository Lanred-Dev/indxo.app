<script lang="ts">
    import type { PublicSet } from "$lib/database/documents/Set";

    let { _id, name, subject, description, terms }: PublicSet = $props();
</script>

<div class="primary inline-block w-full border border-primary">
    <a
        class="flex h-full w-full flex-col justify-between gap-4 overflow-hidden px-8 py-6 [&>p]:leading-tight"
        href="/set/{_id}"
    >
        <div class="w-full">
            <p class="w-full overflow-hidden overflow-ellipsis text-xl font-bold">{name}</p>

            <div class="[&>p]:text-dark flex items-center gap-2 [&>p]:text-sm">
                {#if subject.length > 0}
                    <p>{subject}</p>
                {/if}

                <p>{terms.length} {terms.length === 1 ? "term" : "terms"}</p>
            </div>
        </div>

        <p class="text-light line-clamp-1 overflow-hidden overflow-ellipsis">{description}</p>
    </a>
</div>

<script lang="ts">
    import type { PublicSet } from "$lib/database/documents/Set";

    let { _id, name, subject, description, terms }: PublicSet = $props();
</script>

<div class="inline-block w-full">
    <a class="secondary h-full w-full space-y-2 overflow-hidden" href="/set/{_id}">
        <div class="w-full">
            <div class="[&>p]:text-dark flex items-center gap-2 [&>p]:leading-none">
                {#if subject.length > 0}
                    <p>{subject}</p>
                {/if}

                <p class="leading-tight">{terms.length} {terms.length === 1 ? "term" : "terms"}</p>
            </div>

            <p class="w-full overflow-hidden overflow-ellipsis text-2xl font-bold">{name}</p>
        </div>

        <p class="text-light line-clamp-1 overflow-hidden overflow-ellipsis">{description}</p>
    </a>
</div>

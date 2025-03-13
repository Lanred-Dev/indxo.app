<script lang="ts">
    import type { PublicSet } from "$lib/database/documents/Set";

    let { _id, name, subject, description, terms }: PublicSet = $props();
</script>

<a class="button-primary inline-block w-full space-y-2" href="/set/{_id}">
    <div class="w-full">
        <p class="w-full overflow-hidden overflow-ellipsis text-2xl font-bold">{name}</p>

        <div class="[&>p]:text-dark flex items-center gap-4 [&>p]:leading-none">
            {#if subject.length > 0}
                <p>{subject}</p>
            {/if}

            <p class="leading-tight">{terms.length} {terms.length === 1 ? "term" : "terms"}</p>
        </div>
    </div>

    <p class="text-light line-clamp-1 overflow-hidden overflow-ellipsis">{description}</p>
</a>

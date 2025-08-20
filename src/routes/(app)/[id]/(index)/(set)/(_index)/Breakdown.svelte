<script lang="ts">
    import { getContext } from "svelte";
    import type { DocumentContext } from "../../+page.svelte";
    import { format } from "date-fns";
    import { Wording } from "$lib/utils/wording";

    let document: DocumentContext = getContext("document");
</script>

{#snippet info(icon: string, title: string, text: string)}
    <div class="flex flex-wrap items-center justify-between gap-x-5 gap-y-1.5">
        <div class="flex items-center gap-2">
            <img class="size-6 rounded-full" src={icon} alt={title} />
            <p>{title}</p>
        </div>

        <p class="font-semibold">{text}</p>
    </div>
{/snippet}

<div class="mt-15">
    {#if document.description && document.description.length > 0}
        <p class="break-word mb-8 text-lg">{document.description}</p>
    {/if}

    <div class="flex w-full flex-col gap-y-3">
        {@render info(
            "/icons/general/Terms.svg",
            "Terms",
            `${document.terms.length} ${document.terms.length === 1 ? Wording.term : Wording.terms}`
        )}

        {@render info(
            "/icons/general/Created.svg",
            "Created on",
            format(document.created, "dd/MM/yyyy")
        )}

        {@render info(document.owner.picture, "Created by", document.owner.name)}
    </div>
</div>

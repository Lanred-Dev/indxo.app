<script lang="ts">
    import { getContext } from "svelte";
    import type { DocumentContext } from "../../+page.svelte";
    import { format } from "date-fns";
    import { Wording } from "$lib/utils/wording";
    import MarkdownText from "$lib/components/MarkdownText.svelte";

    let document: DocumentContext = getContext("document");
</script>

{#snippet info(icon: string, alt: string, title: string, text: string)}
    <div class="flex flex-wrap items-center justify-between gap-x-5 gap-y-1.5">
        <div class="flex items-center gap-2">
            <img class="size-6 rounded-full" src={icon} {alt} />
            <p>{title}</p>
        </div>

        <p class="font-semibold">{text}</p>
    </div>
{/snippet}

<div class="mt-15">
    {#if document.data.description && document.data.description.length > 0}
        <MarkdownText class="break-word mb-8 text-lg" text={document.data.description} />
    {/if}

    <div class="flex w-full flex-col gap-y-3">
        {@render info(
            "/icons/general/Terms.svg",
            "Terms",
            "Terms",
            `${document.data.terms.length} ${document.data.terms.length === 1 ? Wording.term : Wording.terms}`
        )}

        {@render info(
            "/icons/general/Calendar.svg",
            "Calendar",
            "Created on",
            format(document.data.created, "MM/dd/yyyy")
        )}

        {@render info(
            document.data.owner.picture,
            document.data.owner.name,
            "Created by",
            document.data.owner.name
        )}

        {#if document.data.updated}
            {@render info(
                "/icons/general/Clock.svg",
                "Clock",
                "Last updated",
                format(document.data.updated, "MM/dd/yyyy")
            )}
        {/if}
    </div>
</div>

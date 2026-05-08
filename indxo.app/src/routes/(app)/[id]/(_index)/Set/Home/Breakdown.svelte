<script lang="ts">
    import { getContext } from "svelte";
    import type { DocumentContext } from "../../+page.svelte";
    import { format } from "date-fns";
    import { Wording } from "$lib/utils/wording";
    import MarkdownText from "$lib/components/MarkdownText.svelte";
    import Icon from "$lib/components/Icon.svelte";

    let document: DocumentContext = getContext("document");
</script>

{#snippet info(icon: string, title: string, text: string, href: string = "")}
    <svelte:element
        this={href.length > 0 ? "a" : "div"}
        {href}
        class="container-primary flex w-full gap-x-3"
    >
        <Icon class="size-6 rounded-full" {icon} />

        <div
            class="flex grow flex-col flex-wrap items-start justify-between gap-x-5 lg:flex-row lg:items-center"
        >
            <p>{title}</p>
            <p class="font-semibold">{text}</p>
        </div>
    </svelte:element>
{/snippet}

<div class="mt-15">
    {#if document.data.description && document.data.description.length > 0}
        <MarkdownText class="break-word mb-8 text-lg" text={document.data.description} />
    {/if}

    <div class="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
        {@render info(
            "general/CardStack",
            "Terms",
            `${document.data.terms.length} ${document.data.terms.length === 1 ? Wording.term : Wording.terms}`
        )}

        {@render info(
            "general/Calendar",
            "Created on",
            format(document.data.created, "MM/dd/yyyy")
        )}

        {@render info(
            document.data.owner.picture,
            "Created by",
            document.data.owner.name,
            `/${document.data.owner._id}`
        )}

        {#if document.data.updated}
            {@render info(
                "general/Clock",
                "Last updated on",
                format(document.data.updated, "MM/dd/yyyy")
            )}
        {/if}
    </div>
</div>

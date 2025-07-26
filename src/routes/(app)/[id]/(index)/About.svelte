<script lang="ts">
    import { formatDistanceToNow } from "date-fns";
    import type { DocumentContext } from "./+page.svelte";
    import { getContext } from "svelte";
    import type { ClassValue } from "svelte/elements";

    let { class: className }: { class?: ClassValue } = $props();

    let document: DocumentContext = getContext("document");
</script>

<div class={["my-20 flex flex-col gap-y-6", className]}>
    <a class="flex gap-2" href="/user/{document.owner._id}">
        <img
            src={document.owner.picture}
            alt={document.owner.name}
            class="border-primary size-11 rounded-full border"
        />

        <div class="text-sm">
            <p class="text-dark leading-snug">Created by</p>
            <p class="text-lg leading-tight font-bold">{document.owner.name}</p>
            <p class="text-light leading-none font-semibold">
                {formatDistanceToNow(document.created ?? Date.now(), {
                    includeSeconds: true,
                    addSuffix: true,
                })}
            </p>
        </div>
    </a>

    {#if document.description && document.description.length > 0}
        <p class="break-word text-lg">{document.description}</p>
    {/if}
</div>

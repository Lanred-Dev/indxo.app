<script lang="ts">
    import { slide } from "svelte/transition";
    import { getContext } from "svelte";
    import type { SessionContext } from "$lib/utils/global";
    import {
        DocumentType,
        type PublicFolder,
        type PublicSet,
        type PublicUser,
    } from "$lib/documents";
    import Card from "./Card.svelte";
    import { Wording } from "$lib/utils/wording";
    import { formatDate } from "date-fns";
    import determineDocumentType from "$lib/utils/document/determineType";
    import type { CardBreadcrumb, CardDocumentType } from ".";
    import Chevron, { ChevronState } from "../Icons/Chevron.svelte";

    let {
        isCollapsible = true,
        name,
        documents,
    }: {
        isCollapsible?: boolean;
        name?: string;
        documents: CardDocumentType[];
    } = $props();

    const session: SessionContext = getContext("session");
    let visible: boolean = $state.raw(true);

    function getDocumentInfo(document: CardDocumentType): {
        type: DocumentType | null;
        breadcrumbs: CardBreadcrumb[];
    } {
        const type = determineDocumentType(document);
        const breadcrumbs: CardBreadcrumb[] = [];

        breadcrumbs.push({
            text: formatDate(document.created, "MM/dd/yyyy"),
            icon: "/icons/general/Calendar.svg",
        });

        if ("owner" in document && session.user._id !== document.owner._id)
            breadcrumbs.push({ text: document.owner.name, icon: document.owner.picture });

        switch (type) {
            case DocumentType.set: {
                if ("subject" in document && document.subject.length > 0)
                    breadcrumbs.push({ text: document.subject });

                const terms: number = (document as PublicSet).terms.length;
                breadcrumbs.push({
                    text: `${terms} ${terms === 1 ? Wording.term : Wording.terms}`,
                });
                break;
            }
            case DocumentType.folder: {
                const sets: number = (document as PublicFolder).sets.length;
                breadcrumbs.push({ text: `${sets} ${sets === 1 ? Wording.set : Wording.sets}` });
                break;
            }
            case DocumentType.user: {
                const sets: number = (document as PublicUser).sets.length;
                breadcrumbs.push({ text: `${sets} ${sets === 1 ? Wording.set : Wording.sets}` });
                const folders: number = (document as PublicUser).folders.length;
                breadcrumbs.push({
                    text: `${folders} ${folders === 1 ? Wording.folder : Wording.folders}`,
                });
                break;
            }
        }

        return { type, breadcrumbs };
    }
</script>

<div class="list-primary">
    {#if typeof name === "string" && name.length > 0}
        <button
            class="flex-center list-title gap-1 {!isCollapsible ? 'pointer-events-none' : ''}"
            onclick={() => (visible = !visible)}
            aria-label="Collapse {name}"
        >
            {name}

            {#if isCollapsible}
                <Chevron class="size-5" state={visible ? ChevronState.up : ChevronState.down} />
            {/if}
        </button>
    {/if}

    {#if visible}
        <ul class="list-container" transition:slide>
            {#each documents as document}
                {@const { type, breadcrumbs } = getDocumentInfo(document)}

                {#if type}
                    <li class="w-full">
                        {#if type === DocumentType.folder}
                            <Card
                                name={document.name}
                                description={(document as PublicFolder).description}
                                url="/{document._id}"
                                icon={(document as PublicFolder).icon}
                                {breadcrumbs}
                            />
                        {:else if type === DocumentType.set}
                            <Card
                                name={document.name}
                                description={(document as PublicSet).description}
                                url="/{document._id}"
                                {breadcrumbs}
                            />
                        {:else if type === DocumentType.user}
                            <Card name={document.name} url="/{document._id}" {breadcrumbs} />
                        {/if}
                    </li>
                {/if}
            {/each}
        </ul>
    {/if}
</div>

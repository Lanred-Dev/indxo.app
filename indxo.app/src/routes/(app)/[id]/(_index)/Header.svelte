<script lang="ts">
    import ActionButton from "$lib/components/ActionButton.svelte";
    import Star from "$lib/components/Icons/Star.svelte";
    import { DocumentPermission, DocumentType } from "$lib/documents";
    import { getContext, type ComponentProps } from "svelte";
    import type { DocumentContext } from "./+page.svelte";
    import determineDocumentType from "$lib/utils/document/determineType";
    import { ResponseCodes } from "$lib/utils/apiResponses";
    import isPermissionEqual from "$lib/utils/document/isPermissionEqual";
    import { goto } from "$app/navigation";
    import type { SessionContext, ViewportContext } from "$lib/utils/global";

    const document: DocumentContext = getContext("document");
    const viewport: ViewportContext = getContext("viewport");
    const session: SessionContext = getContext("session");
    const documentType: DocumentType = $derived.by(() => determineDocumentType(document.data._id) ?? DocumentType.set);
    const buttons: ComponentProps<typeof ActionButton>[] = $derived.by(() => {
        const buttons: ComponentProps<typeof ActionButton>[] = [];

        switch (documentType) {
            case DocumentType.set:
            case DocumentType.folder: {
                if (session.session) {
                    buttons.push({
                        image: {
                            Component: Star,
                            properties: {
                                fill: document.data.isFavorite ? "var(--color-attention)" : "#000000",
                            },
                        },
                        text: "Favorite",
                        onclick: async () => {
                            const response = await fetch(
                                `/api/documents/${document.data._id}/favorite`,
                                {
                                    method: "PUT",
                                    body: JSON.stringify(!document.data.isFavorite),
                                }
                            );

                            if (response.status === ResponseCodes.SuccessNoResponse)
                                document.data.isFavorite = !document.data.isFavorite;
                        },
                    });

                    buttons.push({
                        image: { url: "/icons/general/CopyDocument.svg" },
                        text: "Copy",
                        onclick: async () => {
                            viewport.isNavigating = true;

                            const response = await fetch("?/copyDocument", {
                                method: "POST",
                                body: new FormData(),
                            });

                            if (response.status !== ResponseCodes.Success) {
                                // TODO: Implement error handling
                            } else {
                                const [_, raw] = JSON.parse((await response.json()).data);
                                goto(`/${JSON.parse(raw)}`);
                            }

                            viewport.isNavigating = false;
                        },
                    });
                }

                if (isPermissionEqual(document.permission, DocumentPermission.edit))
                    buttons.push({
                        image: { url: "/icons/general/Pencil.svg" },
                        text: "Edit",
                        onclick: () => {
                            goto(`${document.data._id}/edit`);
                        },
                    });

                if (isPermissionEqual(document.permission, DocumentPermission.owner))
                    buttons.push({
                        image: { url: "/icons/general/Trash.svg" },
                        text: "Delete",
                        onclick: async () => {
                            const response = await fetch(`/api/documents/${document.data._id}`, {
                                method: "DELETE",
                            });

                            if (response.status === ResponseCodes.SuccessNoResponse)
                                goto(
                                    `/my/${determineDocumentType(document.data._id) === DocumentType.folder ? "folders" : "sets"}`
                                );
                        },
                    });

                break;
            }
        }

        return buttons;
    });
    const image: string | undefined = $derived.by(() => {
        switch (documentType) {
            case DocumentType.folder:
                return document.data.icon;
            case DocumentType.user:
                return document.data.picture;
            default:
                return undefined;
        }
    });
    const description: string | { url: string; text: string } | undefined = $derived.by(() => {
        switch (documentType) {
            case DocumentType.folder:
                return document.data.description;
            case DocumentType.set:
                return {
                    url: `/search?query=${document.data.subject}&filter=${DocumentType.set}`,
                    text: document.data.subject,
                };
            default:
                return undefined;
        }
    });
</script>

<svelte:head>
    <title>{document.data.name}</title>

    {#if image}
        <link rel="icon" href={image} />
    {/if}

    {#if description}
        {#if typeof description === "string"}
            <meta name="description" content={description} />
        {:else}
            <meta name="description" content={description.text} />
        {/if}
    {/if}
</svelte:head>

<div class="page-title">
    {#if description}
        {#if typeof description === "string"}
            <p class="description">{description}</p>
        {:else}
            <a class="description" href={description.url}>{description.text}</a>
        {/if}
    {/if}

    <div
        class="flex flex-col items-start justify-between gap-x-12 gap-y-3 lg:flex-row lg:items-center"
    >
        <div class="flex max-w-full grow basis-full items-center gap-2">
            {#if image}
                <img src={image} class="size-14 rounded-full" alt={document.data.name} />
            {/if}

            <h1 class="title">
                <a href="/{document.data._id}">{document.data.name}</a>
            </h1>
        </div>

        {#if document.header.showActions}
            <div class="flex-center min-w-fit -translate-x-2 gap-2 lg:translate-x-2">
                {#each buttons as button}
                    <ActionButton class="button-icon" {...button} />
                {/each}
            </div>
        {/if}
    </div>
</div>

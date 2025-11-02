<script lang="ts">
    import ActionButton from "$lib/components/ActionButton.svelte";
    import Star from "$lib/components/Icons/Star.svelte";
    import { DocumentPermission, DocumentType } from "$lib/documents";
    import { getContext, type ComponentProps } from "svelte";
    import type { DocumentContext, DocumentHeaderContext } from "./+page.svelte";
    import determineDocumentType from "$lib/utils/document/determineType";
    import { ResponseCodes } from "$lib/utils/apiResponses";
    import isPermissionEqual from "$lib/utils/document/isPermissionEqual";
    import { goto } from "$app/navigation";
    import type { SessionContext } from "$lib/utils/global";

    const document: DocumentContext = getContext("document");
    const documentHeader: DocumentHeaderContext = getContext("documentHeader");
    const session: SessionContext = getContext("session");
    const documentType: DocumentType = determineDocumentType(document._id)!;
    const buttons: ComponentProps<typeof ActionButton>[] = $derived.by(() => {
        const buttons: ComponentProps<typeof ActionButton>[] = [];

        switch (documentType) {
            case DocumentType.set:
            case DocumentType.folder: {
                if (session.session)
                    buttons.push({
                        image: {
                            Component: Star,
                            properties: {
                                fill: document.isFavorite ? "var(--color-attention)" : "#000000",
                            },
                        },
                        text: "Favorite",
                        onclick: async () => {
                            const response = await fetch(
                                `/api/documents/${document._id}/favorite`,
                                {
                                    method: "PUT",
                                    body: JSON.stringify(!document.isFavorite),
                                }
                            );

                            if (response.status === ResponseCodes.SuccessNoResponse)
                                document.isFavorite = !document.isFavorite;
                        },
                    });

                if (isPermissionEqual(document.permission, DocumentPermission.edit))
                    buttons.push({
                        image: { url: "/icons/general/Pencil.svg" },
                        text: "Edit",
                        onclick: () => {
                            goto(`${document._id}/edit`);
                        },
                    });

                buttons.push({
                    image: { url: "/icons/general/Clipboard.svg" },
                    text: "Copy",
                    onclick: async () => {
                        const response = await fetch(`/api/documents/${document._id}/copy`, {
                            method: "POST",
                        });

                        if (response.status === ResponseCodes.Success)
                            goto(`/${await response.json()}`);
                    },
                });

                if (isPermissionEqual(document.permission, DocumentPermission.owner))
                    buttons.push({
                        image: { url: "/icons/general/Trash.svg" },
                        text: "Delete",
                        onclick: async () => {
                            const response = await fetch(`/api/documents/${document._id}`, {
                                method: "DELETE",
                            });

                            if (response.status === ResponseCodes.SuccessNoResponse)
                                goto(
                                    `/my/${determineDocumentType(document._id) === DocumentType.folder ? "folders" : "sets"}`
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
                return document.icon;
            case DocumentType.user:
                return document.picture;
            default:
                return undefined;
        }
    });
    const description: string | { url: string; text: string } | undefined = $derived.by(() => {
        switch (documentType) {
            case DocumentType.folder:
                return document.description;
            case DocumentType.set:
                return {
                    url: `/search?query=${document.subject}&filter=${DocumentType.set}`,
                    text: document.subject,
                };
            default:
                return undefined;
        }
    });
</script>

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
                <img src={image} class="size-14 rounded-full" alt={document.name} />
            {/if}

            <h1 class="title">{document.name}</h1>
        </div>

        {#if documentHeader.showActions}
            <div class="flex-center min-w-fit -translate-x-2 gap-2 lg:translate-x-2">
                {#each buttons as button}
                    <ActionButton class="button-icon" {...button} />
                {/each}
            </div>
        {/if}
    </div>
</div>

<script lang="ts">
    import { goto } from "$app/navigation";
    import type { PublicFolder } from "$lib/database/documents/Folder";
    import type { PublicSet } from "$lib/database/documents/Set";

    let {
        hasPermission,
        isFavorite = $bindable(false),
        type,
        document,
    }: {
        hasPermission: boolean;
        isFavorite: boolean;
        type: "set" | "folder";
        document: PublicSet | PublicFolder;
    } = $props();

    /**
     * Sends a request to the server to update the favorite status of the set.
     *
     * @returns never
     */
    async function toggleDocumentInFavorites() {
        const response: Response = await fetch(`/api/documents/${type}/${document._id}/favorite`);

        if (response.status === 200) isFavorite = await response.json();
    }

    /**
     * Sends a request to the server to delete the set.
     *
     * @returns never
     */
    async function deleteDocument() {
        const response: Response = await fetch(`/api/documents/${type}/${document._id}/delete`, {
            method: "DELETE",
        });

        if (response.status === 204) goto(`/my/${type}s`);
    }
</script>

<div class="mb-10 w-full">
    {#if "subject" in document && document.subject.length > 0}
        <a
            class="text-light text-xl leading-none font-semibold"
            href="/search?query={(document as PublicSet).subject}&returnOnly=set"
            >{(document as PublicSet).subject}</a
        >
    {/if}

    <div
        class="flex flex-col items-start justify-between gap-x-12 gap-y-3 lg:flex-row lg:items-center"
    >
        <div class="flex max-w-full grow basis-full items-center gap-2">
            {#if "icon" in document}
                <img src={document?.icon} alt="Folder" class="size-14" />
            {/if}

            <h1 class="page-title break-word w-full">{document?.name}</h1>
        </div>

        <div class="flex-center min-w-fit -translate-x-2 gap-2 sm:translate-x-2">
            <button class="button-icon" onclick={toggleDocumentInFavorites}>
                <img
                    src={isFavorite ? "/icons/general/StarColored.svg" : "/icons/general/Star.svg"}
                    alt="Favorite"
                />
            </button>

            {#if hasPermission}
                <a class="button-icon" href="/{type}/{document._id}/edit">
                    <img src="/icons/general/Pencil.svg" alt="Edit" />
                </a>

                <button class="button-icon" onclick={deleteDocument}>
                    <img src="/icons/general/TrashColored.svg" alt="Delete" />
                </button>
            {/if}
        </div>
    </div>
</div>

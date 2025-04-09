<script lang="ts">
    import { goto } from "$app/navigation";
    import type { PublicFolder } from "$lib/database/documents/Folder";

    let {
        hasPermission,
        isFavorite = $bindable(false),
        folder,
    }: {
        hasPermission: boolean;
        isFavorite: boolean;
        folder: PublicFolder;
    } = $props();

    /**
     * Sends a request to the server to update the favorite status of the folder.
     *
     * @returns never
     */
    async function toggleFolderInFavorites() {
        const response = await fetch(`/api/documents/folder/${folder._id}/favorite`);

        if (response.status === 200) isFavorite = await response.json();
    }

    /**
     * Sends a request to the server to delete the folder.
     *
     * @returns never
     */
    async function deleteFolder() {
        const response = await fetch(`/api/documents/folder/${folder._id}/delete`, {
            method: "DELETE",
        });

        if (response.status === 204) goto("/");
    }
</script>

<div class="mb-10 flex w-full items-center justify-between">
    <div class="flex items-center gap-2">
        <img src={folder?.icon} alt="Folder" class="size-14" />
        <h1 class="page-title">{folder?.name}</h1>
    </div>

    <div class="flex-center">
        {#if hasPermission === true}
            <a class="button-icon" href="/folder/{folder._id}/edit">
                <img src="/icons/general/Pencil.svg" alt="Edit" />
            </a>
        {/if}

        <button class="button-icon" onclick={toggleFolderInFavorites}>
            <img
                src={isFavorite ? "/icons/general/StarColored.svg" : "/icons/general/Star.svg"}
                alt="Favorite"
            />
        </button>

        <button class="button-icon" onclick={deleteFolder}>
            <img src="/icons/general/TrashColored.svg" alt="Delete" />
        </button>
    </div>
</div>

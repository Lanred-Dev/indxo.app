<script lang="ts">
    import { goto } from "$app/navigation";
    import type { PublicSet } from "$lib/database/documents/Set";

    let {
        hasPermission,
        isFavorite = $bindable(false),
        set,
    }: {
        hasPermission: boolean;
        isFavorite: boolean;
        set: PublicSet;
    } = $props();

    /**
     * Sends a request to the server to update the favorite status of the set.
     *
     * @returns never
     */
    async function toggleSetInFavorites() {
        const { success, favorite }: { success: boolean; favorite: boolean } = await (
            await fetch(`/api/documents/set/${set._id}/favorite`)
        ).json();

        if (success) isFavorite = favorite;
    }

    /**
     * Sends a request to the server to delete the set.
     *
     * @returns never
     */
    async function deleteSet() {
        const { success }: { success: boolean } = await (
            await fetch(`/api/documents/set/${set._id}/delete`, {
                method: "DELETE",
            })
        ).json();

        if (success) goto("/");
    }
</script>

<div class="mb-10 w-full">
    {#if set?.subject.length ?? 0 > 0}
        <a
            class="text-light text-xl leading-tight"
            href="/search?query={set?.subject}&returnOnly=set">{set?.subject}</a
        >
    {/if}

    <div class="flex items-center justify-between">
        <h1 class="page-title">{set?.name}</h1>

        <div class="flex-center">
            {#if hasPermission === true}
                <a class="button-icon" href="/set/{set._id}/edit">
                    <img src="/icons/general/Pencil.svg" alt="Edit" />
                </a>
            {/if}

            <button class="button-icon" onclick={toggleSetInFavorites}>
                <img
                    src={isFavorite ? "/icons/general/StarColored.svg" : "/icons/general/Star.svg"}
                    alt="Favorite"
                />
            </button>

            <button class="button-icon" onclick={deleteSet}>
                <img src="/icons/general/TrashColored.svg" alt="Delete" />
            </button>
        </div>
    </div>
</div>

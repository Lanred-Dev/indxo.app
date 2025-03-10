<script lang="ts">
    import { goto } from "$app/navigation";
    import type { PublicSet } from "$lib/database/documents/Set";
    import { formatDistanceToNow } from "date-fns";

    let {
        hasEditPermission,
        // This is has to be a $state because it will be updated when the user clicks the button. Thats why this value is not just being used directly
        didFavorite,
        set,
    }: { hasEditPermission: boolean; didFavorite: boolean; set: PublicSet } = $props();

    let isFavorite: boolean = $state(didFavorite);

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

<div class="space-y-6">
    <div class="flex flex-wrap gap-3">
        {#if hasEditPermission === true}
            <a class="secondary" href="/set/{set._id}/edit">
                <img src="/icons/general/Pencil.svg" alt="Edit" />
                <span>Edit</span>
            </a>
        {/if}

        <button
            class="secondary {isFavorite ? '!bg-[#C8B273]' : ''}"
            onclick={toggleSetInFavorites}
        >
            <img src="/icons/general/Star.svg" alt="Favorite" />
            <span>{isFavorite ? "Unfavorite" : "Favorite"}</span>
        </button>

        <button class="secondary !bg-button-danger" onclick={deleteSet}>
            <img src="/icons/general/Trash.svg" alt="Delete" />
            <span>Delete</span>
        </button>
    </div>

    <p class="text-lg">{set.description}</p>

    <a class="flex gap-2" href="/account/{set.owner._id}">
        <img
            src={set.owner.image}
            alt={set.owner.name}
            class="size-11 rounded-full border border-primary"
        />

        <div class="[&>p]:leading-tight">
            <p class="text-dark text-sm leading-snug">Created by</p>
            <p class="text-lg font-bold">{set.owner.name}</p>
            <p class="text-light text-sm">
                {formatDistanceToNow(set.created ?? new Date(), {
                    includeSeconds: true,
                    addSuffix: true,
                })}
            </p>
        </div>
    </a>
</div>

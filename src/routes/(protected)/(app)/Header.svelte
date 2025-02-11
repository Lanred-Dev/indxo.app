<script lang="ts">
    import { type Writable } from "svelte/store";
    import type { PublicFolder } from "$lib/database/documents/Folder";
    import type { PublicSet } from "$lib/database/documents/Set";
    import type { PublicUser } from "$lib/database/documents/User";

    let { user, sidebarVisible }: { user: any; sidebarVisible: Writable<boolean> } = $props();

    let searching: boolean = $state(false);
    let searchQuery: string = $state("");
    let searchResults: (PublicUser | PublicSet | PublicFolder)[] = $state([]);

    async function search(event: Event) {
        searchQuery = (event.target as HTMLInputElement)?.value;

        // 3 is the minimum search query
        if (searchQuery.length < 3) return;

        searchResults = await (
            await fetch("/api/search", {
                method: "POST",
                body: JSON.stringify({
                    query: searchQuery,
                }),
            })
        ).json();
    }
</script>

{#snippet searchResult({
    name,
    icon,
    description,
    subject,
}: {
    name: string;
    icon?: string;
    description?: string;
    subject?: string;
})}
    <div class="flex items-center gap-1">
        {#if icon}
            <img class="size-6" src={icon} alt={name} />
        {/if}

        <div class="space-y-0.5">
            <p>{name}</p>

            {#if description || subject}
                <p class="text-light text-sm">{description || subject}</p>
            {/if}
        </div>
    </div>
{/snippet}

{#snippet searchCategory(name: string, icon: string)}
    <div class="flex items-center gap-1">
        <img class="size-6" src={icon} alt={name} />
        <p>Search "<span class="max-w-12 text-ellipsis">{searchQuery}</span>" in {name}</p>
    </div>
{/snippet}

<header
    class="relative top-0 flex w-full items-center justify-between border-b border-primary bg-accent-primary px-10 py-4"
>
    <div class="flex-center gap-1">
        <button onclick={() => sidebarVisible.update((visible: boolean) => !visible)}>
            <img class="aspect-1 h-10" src="/icons/navigation/Hamburger.svg" alt="Sidebar toggle" />
        </button>
    </div>

    <div class="w-72">
        <input
            class="primary w-full"
            type="text"
            placeholder="Search"
            oninput={search}
            onfocus={() => {
                searching = true;
            }}
            onblur={() => {
                searching = false;
            }}
        />
    </div>

    <div>
        <img
            class="aspect-1 h-10 rounded-full border border-primary"
            src={user.image}
            alt={user.name}
        />
    </div>

    <div
        class="x-center primary top-full z-50 w-96 rounded-lg border border-primary"
        style:display={searching && searchQuery.length > 0 ? "block" : "none"}
    >
        <div class="space-y-2 p-4">
            {#each searchResults as result}
                {@render searchResult(result)}
            {/each}

            {@render searchCategory("Users", "/icons/navigation/Account.svg")}
            {@render searchCategory("Sets", "/icons/navigation/Document.svg")}
            {@render searchCategory("Folders", "/icons/navigation/Folder.svg")}
        </div>
    </div>
</header>

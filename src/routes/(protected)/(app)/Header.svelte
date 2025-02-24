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

    function determineResultType({
        icon,
        image,
        subject,
    }: {
        icon?: string;
        image?: string;
        subject?: string;
    }): "account" | "folder" | "set" {
        if (icon) return "folder";
        if (subject) return "set";
        if (image) return "account";

        return "account";
    }
</script>

{#snippet searchResult({
    _id,
    name,
    icon,
    image,
    description,
    subject,
}: {
    _id: string;
    name: string;
    icon?: string;
    image?: string;
    description?: string;
    subject?: string;
})}
    <a
        class="flex items-center gap-1"
        href="/{determineResultType({ icon, image, subject })}/{_id}"
    >
        {#if icon}
            <img class="size-6" src={icon} alt={name} />
        {/if}

        <div class="[&>p]:leading-tight">
            <p>{name}</p>

            {#if description || subject}
                <p class="text-light text-sm">{description || subject}</p>
            {/if}
        </div>
    </a>
{/snippet}

{#snippet searchCategory(id: string, name: string, icon: string)}
    <a class="flex items-center gap-1" href="/search?query={searchQuery}&category={id}">
        <img class="size-5" src={icon} alt={name} />
        <p>Search "<span class="max-w-12 text-ellipsis">{searchQuery}</span>" in {name}</p>
    </a>
{/snippet}

<header
    class="relative top-0 flex w-full items-center justify-between border-b border-primary bg-accent-primary px-10 py-4"
>
    <div class="flex-center gap-1">
        <button onclick={() => sidebarVisible.update((visible: boolean) => !visible)}>
            <img class="size-10" src="/icons/navigation/Hamburger.svg" alt="Sidebar toggle" />
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
        <img class="size-10 rounded-full border border-primary" src={user.image} alt={user.name} />
    </div>

    <div
        class="x-center primary top-full z-50 w-96 rounded-lg border border-primary"
        style:display={searching && searchQuery.length > 0 ? "block" : "none"}
    >
        <div class="space-y-2 p-4">
            {#each searchResults as result}
                {@render searchResult(result as any)}
            {/each}

            {@render searchCategory("user", "Users", "/icons/navigation/Account.svg")}
            {@render searchCategory("set", "Sets", "/icons/navigation/Document.svg")}
            {@render searchCategory("folder", "Folders", "/icons/navigation/Folder.svg")}
        </div>
    </div>
</header>

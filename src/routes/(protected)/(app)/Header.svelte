<script lang="ts">
    import { type Writable } from "svelte/store";
    import type { PublicFolder } from "$lib/database/documents/Folder";
    import type { PublicSet } from "$lib/database/documents/Set";
    import type { PublicUser } from "$lib/database/documents/User";
    import type { User } from "@auth/sveltekit";
    import determineSearchResultType from "$lib/utils/determineSearchResultType";
    import { onMount } from "svelte";
    import { signOut } from "@auth/sveltekit/client";

    let { user, sidebarVisible }: { user: User; sidebarVisible: Writable<boolean> } = $props();

    let showAccountInfo: boolean = $state(false);
    let searching: boolean = $state(false);
    let focused: boolean = $state(false);
    let focusedOnResults: boolean = $state(false);
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

    /**
     * Removes focus from the search bar.
     *
     * NOTE: This is mainly used after a user clicks on a search result.
     *
     * @returns never
     */
    function removeFocusFromSearch() {
        focused = false;
        focusedOnResults = false;
        searching = false;
    }

    onMount(() => {
        window.addEventListener("click", (event: MouseEvent) => {
            if (showAccountInfo && !(event.target as HTMLElement).closest("header")) {
                showAccountInfo = false;
            }
        });
    });
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
        href="/{determineSearchResultType({ icon, image, subject })}/{_id}"
        onclick={removeFocusFromSearch}
        data-sveltekit-reload
    >
        {#if icon || image}
            <img class="size-6 {image ? 'rounded-full' : ''}" src={icon || image} alt={name} />
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
    <a
        class="flex items-center gap-1"
        href="/search?query={searchQuery}&returnOnly={id}"
        onclick={removeFocusFromSearch}
        data-sveltekit-reload
    >
        <img class="size-6" src={icon} alt={name} />
        <p class="flex-center text-nowrap">
            <span>Search "</span>
            <span class="block w-full max-w-20 overflow-hidden text-ellipsis"
                >{searchQuery.trim()}</span
            >
            <span>" in {name}</span>
        </p>
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

    <div data-input class="flex-center w-[40vw] gap-2">
        <img class="size-5" src="/icons/general/Search.svg" alt="Search" />

        <input
            class="w-full border-0 bg-transparent p-0 outline-none focus:ring-0"
            type="text"
            placeholder="Looking for something?"
            oninput={search}
            onfocus={() => {
                focused = true;
                searching = true;
            }}
            onblur={() => {
                focused = false;

                if (focusedOnResults) return;

                searching = false;
            }}
        />
    </div>

    <button onclick={() => (showAccountInfo = !showAccountInfo)}>
        <img class="size-10 rounded-full border border-primary" src={user.image} alt={user.name} />
    </button>

    <!--Search results-->
    <div
        class="x-center primary top-[90%] z-50 w-[40vw] rounded-lg border border-primary p-4"
        style:display={searching && searchQuery.length > 0 ? "block" : "none"}
        onmouseenter={() => {
            focusedOnResults = true;
            searching = true;
        }}
        onmouseleave={() => {
            focusedOnResults = false;
            if (focused) return;

            searching = false;
        }}
        role="region"
    >
        <div class="space-y-3">
            {#each searchResults as result}
                {@render searchResult(result as any)}
            {/each}

            {@render searchCategory("user", "Users", "/icons/navigation/Account.svg")}
            {@render searchCategory("set", "Sets", "/icons/navigation/Document.svg")}
            {@render searchCategory("folder", "Folders", "/icons/navigation/Folder.svg")}
        </div>
    </div>

    <!--Account info-->
    <div
        class="primary absolute right-10 top-[90%] z-50 space-y-6 rounded-lg border border-primary p-4"
        style:display={showAccountInfo ? "block" : "none"}
    >
        <div class="flex-center w-full gap-2">
            <img
                class="size-10 rounded-full border border-primary"
                src={user.image}
                alt={user.name}
            />

            <div class="space-y-0.5 [&>p]:leading-none">
                <p class="text-lg font-bold">{user.name}</p>
                <p>{user.email}</p>
            </div>
        </div>

        <button
            class="flex w-full items-center gap-1 rounded-button bg-red-400 bg-opacity-20 px-3 py-2 font-bold"
            onclick={() => signOut()}
        >
            <img class="size-6" src="/icons/general/LogOut.svg" alt="Log out" />
            Log out</button
        >
    </div>
</header>

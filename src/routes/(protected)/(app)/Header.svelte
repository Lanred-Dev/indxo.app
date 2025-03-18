<script lang="ts">
    import { type Writable } from "svelte/store";
    import type { SimpleFolder } from "$lib/database/documents/Folder";
    import type { SimpleSet } from "$lib/database/documents/Set";
    import type { SimpleUser } from "$lib/database/documents/User";
    import type { User } from "@auth/sveltekit";
    import determineDocumentType from "$lib/utils/determineDocumentType";
    import { signOut } from "@auth/sveltekit/client";
    import { goto } from "$app/navigation";
    import { fly } from "svelte/transition";

    let {
        user,
        sidebarVisible,
        mobileSidebarVisible,
    }: { user: User; sidebarVisible: Writable<boolean>; mobileSidebarVisible: Writable<boolean> } =
        $props();

    let showAccountInfo: boolean = $state(false);
    let focusedOnAccountInfo: boolean = $state(false);
    let isSearching: boolean = $state(false);
    let focusedOnSearch: boolean = $state(false);
    let focusedOnSearchResults: boolean = $state(false);
    let searchQuery: string = $state("");
    let searchResults: (SimpleUser | SimpleSet | SimpleFolder)[] = $state([]);

    /**
     * Fetches the results to display on the quick search.
     *
     * @param event The event
     * @returns never
     */
    async function search(event: Event) {
        searchQuery = (event.target as HTMLInputElement)?.value;

        // 3 is the minimum search query
        if (searchQuery.length < 3) return (searchResults = []);

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
        isSearching = false;
        focusedOnSearch = false;
        focusedOnSearchResults = false;
    }

    /**
     * Navigates to the search page with the query.
     *
     * @param event The keyboard event
     * @returns never
     */
    function gotoSearch(event: KeyboardEvent) {
        if (event.key !== "Enter" || searchQuery.length === 0 || !focusedOnSearch) return;

        goto(`/search?query=${searchQuery}`);
    }
</script>

<svelte:window
    onkeydown={gotoSearch}
    onfocusout={() => {
        if (focusedOnAccountInfo) return;

        showAccountInfo = false;
    }}
/>

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
        href="/{determineDocumentType({ icon, image, subject })}/{_id}"
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
    class="relative top-0 flex w-full items-center justify-between bg-primary-300 px-7 py-4 md:px-10"
>
    <div class="flex-center gap-1">
        <button
            onclick={() => {
                sidebarVisible.update((visible: boolean) => !visible);
                mobileSidebarVisible.update((visible: boolean) => !visible);
            }}
        >
            <img class="size-7" src="/icons/navigation/Hamburger.svg" alt="Sidebar toggle" />
        </button>
    </div>

    <div class="input-primary flex-center x-center y-center w-[40vw] gap-2">
        <img class="size-5" src="/icons/general/Search.svg" alt="Search" />

        <input
            class="w-full border-0 bg-transparent p-0 outline-none focus:ring-0"
            type="text"
            placeholder="Looking for something?"
            oninput={search}
            onfocusin={() => {
                isSearching = true;
                focusedOnSearch = true;
            }}
            onfocusout={() => {
                focusedOnSearch = false;

                if (!focusedOnSearchResults) isSearching = false;
            }}
        />
    </div>

    <button
        onclick={() => (showAccountInfo = !showAccountInfo)}
        onmouseenter={() => (focusedOnAccountInfo = true)}
        onmouseleave={() => (focusedOnAccountInfo = false)}
    >
        <img class="size-10 rounded-full border border-primary" src={user.image} alt={user.name} />
    </button>

    {#if isSearching && searchQuery.length > 0}
        <div
            class="x-center container-popup top-[90%] w-[40vw]"
            onmouseenter={() => {
                isSearching = true;
                focusedOnSearchResults = true;
            }}
            onmouseleave={() => {
                focusedOnSearchResults = false;

                if (!focusedOnSearch) isSearching = false;
            }}
            role="region"
            transition:fly={{ y: 10, duration: 100 }}
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
    {/if}

    {#if showAccountInfo}
        <div
            class="container-popup right-10 top-[90%] space-y-1 !px-1 !pb-1"
            onmouseenter={() => (focusedOnAccountInfo = true)}
            onmouseleave={() => (focusedOnAccountInfo = false)}
            role="region"
            transition:fly={{ y: 10, duration: 100 }}
        >
            <div class="flex-center w-full gap-2 px-3 pb-1">
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

            <ul>
                <li>
                    <a class="button-navigation" href="/settings">
                        <img src="/icons/navigation/Settings.svg" alt="Settings" />
                        <span>Settings</span>
                    </a>
                </li>
            </ul>

            <button class="button-navigation hover:!bg-button-alert" onclick={() => signOut()}>
                <img src="/icons/navigation/LogOut.svg" alt="Log out" />
                <span>Log out</span>
            </button>
        </div>
    {/if}
</header>

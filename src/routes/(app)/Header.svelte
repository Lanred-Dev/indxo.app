<script lang="ts">
    import type { SimpleFolder } from "$lib/database/documents/Folder";
    import type { SimpleSet } from "$lib/database/documents/Set";
    import type { SimpleUser, SimpleUserWithEmail } from "$lib/database/documents/User";
    import determineDocumentType from "$lib/utils/determineDocumentType";
    import { goto } from "$app/navigation";
    import { fly } from "svelte/transition";
    import { getContext } from "svelte";
    import type { Session } from "$lib/database/documents/Session";

    const session: Session | null = getContext("session");
    const user: SimpleUserWithEmail = getContext("user");
    const sidebarVisible: { visible: boolean } = getContext("sidebarVisible");
    let showAccountInfo: boolean = $state.raw(false);
    let focusedOnAccountInfo: boolean = $state.raw(false);
    let isSearching: boolean = $state.raw(false);
    let focusedOnSearch: boolean = $state.raw(false);
    let focusedOnSearchResults: boolean = $state.raw(false);
    let searchQuery: string = $state.raw("");
    let searchResults: (SimpleUser | SimpleSet | SimpleFolder)[] = $state.raw([]);

    /**
     * Fetches the results to display on the quick search.
     *
     * @returns never
     */
    async function search() {
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
</script>

<svelte:window
    onkeydown={(event: KeyboardEvent) => {
        if (event.key !== "Enter" || searchQuery.length === 0 || !focusedOnSearch) return;

        goto(`/search?query=${searchQuery}`);
    }}
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
    class="bg-accent-light relative top-0 flex w-full items-center justify-between px-7 py-4 md:px-10"
>
    <div class="flex-center">
        {#if session !== null}
            <button onclick={() => (sidebarVisible.visible = !sidebarVisible.visible)}>
                <img class="size-7" src="/icons/navigation/Hamburger.svg" alt="Sidebar toggle" />
            </button>
        {/if}
    </div>

    <div class="input-primary flex-center x-center y-center w-[40vw] gap-2">
        <img class="size-5" src="/icons/general/Search.svg" alt="Search" />

        <input
            class="w-full border-0 bg-transparent p-0 outline-hidden focus:ring-0"
            type="text"
            placeholder="Looking for something?"
            bind:value={searchQuery}
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

    {#if session !== null}
        <button
            onclick={() => (showAccountInfo = !showAccountInfo)}
            onmouseenter={() => (focusedOnAccountInfo = true)}
            onmouseleave={() => (focusedOnAccountInfo = false)}
        >
            <img
                class="border-primary size-10 rounded-full border"
                src={user.image}
                alt={user.name}
            />
        </button>
    {:else}
        <a class="button-primary" href="/login">
            <img class="size-5" src="/icons/navigation/Account.svg" alt="Login" />
            <span>Log in</span>
        </a>
    {/if}

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

    {#if showAccountInfo && session !== null}
        <div
            class="container-popup top-[90%] right-10 space-y-1 px-1! pb-1!"
            onmouseenter={() => (focusedOnAccountInfo = true)}
            onmouseleave={() => (focusedOnAccountInfo = false)}
            role="region"
            transition:fly={{ y: 10, duration: 100 }}
        >
            <div class="flex-center w-full gap-2 px-3 pb-1">
                <img
                    class="border-primary size-10 rounded-full border"
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

            <a class="button-navigation hover:bg-accent-alert!" href="/api/auth/logout">
                <img src="/icons/navigation/LogOut.svg" alt="Log out" />
                <span>Log out</span>
            </a>
        </div>
    {/if}
</header>

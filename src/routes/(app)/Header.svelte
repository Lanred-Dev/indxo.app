<script lang="ts">
    import type { SimpleFolder } from "$lib/database/documents/Folder";
    import type { SimpleSet } from "$lib/database/documents/Set";
    import type { SimpleUser, SimpleUserWithEmail } from "$lib/database/documents/User";
    import determineDocumentType from "$lib/utils/determineDocumentType";
    import { goto } from "$app/navigation";
    import { getContext } from "svelte";
    import type { Session } from "$lib/database/documents/Session";
    import Popup from "$lib/components/Popup.svelte";

    const session: Session | null = getContext("session");
    const user: SimpleUserWithEmail = getContext("user");
    const sidebarVisible: { visible: boolean } = getContext("sidebarVisible");
    const headerHeight: { size: number } = getContext("headerHeight");
    let searchQuery: string = $state.raw("");
    let searchResults: (SimpleUser | SimpleSet | SimpleFolder)[] = $state.raw([]);
</script>

<svelte:window
    onkeydown={(event: KeyboardEvent) => {
        if (
            event.key !== "Enter" ||
            searchQuery.length === 0 ||
            !(event.target as HTMLElement).closest("#searchBar")
        )
            return;

        (event.target as HTMLElement).blur();
        goto(`/search?query=${searchQuery}`);
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
    >
        {#if icon || image}
            <img class="size-6 {image ? 'rounded-full' : ''}" src={icon || image} alt={name} />
        {/if}

        <div class="[&>p]:leading-tight">
            <p>{name}</p>

            {#if description || subject}
                <p class="text-light line-clamp-1 text-sm">{description || subject}</p>
            {/if}
        </div>
    </a>
{/snippet}

{#snippet searchCategory(id: string, name: string, icon: string)}
    <a class="flex items-center gap-1" href="/search?query={searchQuery}&returnOnly={id}">
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
    class="bg-accent-light fixed top-0 left-0 z-40 flex w-full items-center justify-between px-7 py-4 md:px-10"
    bind:clientHeight={headerHeight.size}
>
    <div class="flex-center">
        {#if session}
            <button
                id="sidebarToggle"
                onclick={() => (sidebarVisible.visible = !sidebarVisible.visible)}
            >
                <img class="size-7" src="/icons/navigation/Hamburger.svg" alt="Sidebar toggle" />
            </button>
        {/if}
    </div>

    <div class="input-primary x-center y-center w-[40vw] p-0!">
        <img class="y-center left-3 size-5" src="/icons/general/Search.svg" alt="Search" />

        <input
            id="searchBar"
            class="w-full border-0 bg-transparent py-2 pr-3 pl-10 outline-hidden focus:ring-0"
            placeholder="Looking for something?"
            bind:value={searchQuery}
            oninput={async () => {
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
            }}
        />
    </div>

    <Popup buttonID="searchBar" classes="w-[40vw] space-y-3" alignment="center">
        {#each searchResults as result}
            {@render searchResult(result as any)}
        {/each}

        {@render searchCategory("user", "Users", "/icons/navigation/Account.svg")}
        {@render searchCategory("set", "Sets", "/icons/navigation/Document.svg")}
        {@render searchCategory("folder", "Folders", "/icons/navigation/Folder.svg")}
    </Popup>

    {#if session}
        <button id="accountInfoToggle">
            <img
                class="border-primary size-10 rounded-full border"
                src={user.image}
                alt={user.name}
            />
        </button>

        <Popup buttonID="accountInfoToggle" classes="space-y-1 px-1! pb-1!" alignment="right">
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
        </Popup>
    {:else}
        <a class="button-primary" href="/login">
            <img class="size-5" src="/icons/navigation/Account.svg" alt="Login" />
            <span>Log in</span>
        </a>
    {/if}
</header>

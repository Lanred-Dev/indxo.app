<script lang="ts">
    import { getContext } from "svelte";
    import { Popup, PopupContent, PopupTrigger, PopupXAlignment } from "$lib/components/Popup";
    import type { HeaderContext, SessionContext, SidebarContext } from "$lib/utils/global";

    const { session, user }: SessionContext = getContext("session");
    const header: HeaderContext = getContext("header");
    const sidebar: SidebarContext = getContext("sidebar");
</script>

<header
    class="fixed top-0 left-0 z-40 w-full px-2 pt-2 md:px-6 md:pt-4"
    bind:clientHeight={header.height}
>
    <div
        class="bg-attention-bright relative flex w-full items-center justify-between rounded-full px-2 py-2"
    >
        <div class="flex-center gap-3 pl-3">
            {#if session}
                <button id="sidebarToggle" onclick={() => (sidebar.isVisible = !sidebar.isVisible)}>
                    <img
                        class="size-7"
                        src="/icons/navigation/Hamburger.svg"
                        alt="Sidebar toggle"
                    />
                </button>
            {/if}

            <img class="size-7" src="/favicon.png" alt="Logo" />
        </div>

        {#if session}
            <Popup>
                <PopupTrigger>
                    <img
                        class="border-primary size-10 rounded-full border"
                        src={user.picture}
                        alt={user.name}
                    />
                </PopupTrigger>

                <PopupContent class="space-y-1 px-1! pb-1!" xAlignment={PopupXAlignment.right}>
                    <div class="flex-center w-full gap-2 px-3 pb-1">
                        <img
                            class="border-primary size-10 rounded-full border"
                            src={user.picture}
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

                    <a class="button-navigation" href="/logout">
                        <img src="/icons/navigation/LogOut.svg" alt="Log out" />
                        <span>Log out</span>
                    </a>
                </PopupContent>
            </Popup>
        {:else}
            <a class="button-primary rounded-full" href="/login">
                <img class="size-5" src="/icons/navigation/Account.svg" alt="Login" />
                <span>Log in</span>
            </a>
        {/if}
    </div>
</header>

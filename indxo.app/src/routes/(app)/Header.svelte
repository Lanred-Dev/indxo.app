<script lang="ts">
    import { getContext } from "svelte";
    import { Popup, PopupContent, PopupTrigger, PopupXAlignment } from "$lib/components/Popup";
    import type {
        HeaderContext,
        SessionContext,
        SidebarContext,
        ViewportContext,
    } from "$lib/utils/global";

    const session: SessionContext = getContext("session");
    const header: HeaderContext = getContext("header");
    const sidebar: SidebarContext = getContext("sidebar");
    const viewport: ViewportContext = getContext("viewport");
</script>

<header
    class={[
        "fixed top-0 left-0 z-40 flex w-full items-center justify-between border-b px-4 pt-6 pb-3 transition-all duration-500 md:px-8 md:pt-3",
        viewport.scrollY > 5
            ? "bg-light/50 border-b-primary shadow-sm backdrop-blur-sm"
            : "border-transparent bg-transparent shadow-none",
    ]}
    bind:clientHeight={header.height}
>
    <div class="flex-center gap-3 pl-3">
        <button id="sidebarToggle" onclick={() => (sidebar.isVisible = !sidebar.isVisible)}>
            <img class="size-7" src="/icons/navigation/Hamburger.svg" alt="Sidebar toggle" />
        </button>

        <img class="size-7" src="/favicon.svg" alt="Logo" />
    </div>

    {#if session.session}
        <Popup>
            <PopupTrigger>
                <img
                    class="border-primary size-10 rounded-full border"
                    src={session.user.picture}
                    alt={session.user.name}
                />
            </PopupTrigger>

            <PopupContent class="space-y-1 px-1! pb-1!" xAlignment={PopupXAlignment.right}>
                <div class="flex-center w-full gap-2 px-3 pb-1">
                    <img
                        class="border-primary size-10 rounded-full border"
                        src={session.user.picture}
                        alt={session.user.name}
                    />

                    <div class="max-w-svw min-w-48 space-y-0.5 [&>p]:leading-none">
                        <p class="text-lg font-bold">{session.user.name}</p>
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
                    <img src="/icons/navigation/Logout.svg" alt="Log out" />
                    <span>Logout</span>
                </a>
            </PopupContent>
        </Popup>
    {:else}
        <a class="button-attention rounded-full" href="/login">
            <img class="size-5" src="/icons/navigation/Account.svg" alt="Login" />
            <span>Login</span>
        </a>
    {/if}
</header>

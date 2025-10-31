<script lang="ts">
    import { getContext } from "svelte";
    import { fly } from "svelte/transition";
    import { innerHeight } from "svelte/reactivity/window";
    import { Wording } from "$lib/utils/wording";
    import { browser } from "$app/environment";
    import type {
        HeaderContext,
        SessionContext,
        SidebarContext,
        ViewportContext,
    } from "$lib/utils/global";
    import { MyPageType } from "$lib/utils/routing";

    const header: HeaderContext = getContext("header");
    const sidebar: SidebarContext = getContext("sidebar");
    const session: SessionContext = getContext("session");
    const viewport: ViewportContext = getContext("viewport");
</script>

{#snippet group(links: { url: string; text: string; icon: string }[], name?: string)}
    <div>
        {#if name}
            <p class="text-light mb-2 pl-4 text-nowrap">{name}</p>
        {/if}

        <ul>
            {#each links as { url, text, icon }}
                <li>
                    <a class="button-navigation" href={url}>
                        <img src={icon} alt={text} />
                        <span>{text}</span>
                    </a>
                </li>
            {/each}
        </ul>
    </div>
{/snippet}

{#if sidebar.isVisible}
    {#if viewport.isMobile}
        <button
            class="cover-screen fixed top-0 left-0 z-20"
            aria-label="Close sidebar"
            on:click={() => {
                sidebar.isVisible = false;
            }}
        >
        </button>
    {/if}

    <div
        class={[
            "bg-primary fixed left-0 z-30 flex h-full w-4/6 min-w-fit flex-col justify-between gap-10 overflow-x-hidden overflow-y-auto pt-6 pr-4 pb-5.5 pl-4 shadow-2xl transition-transform duration-300 sm:w-2/5 md:w-auto md:bg-transparent md:pr-4 md:pb-7 md:pl-7 md:shadow-none xl:w-[17.5%] 2xl:w-[15%]",
            !browser && "pointer-events-none opacity-0",
        ]}
        style:height="{innerHeight.current ?? 0 - header.height}px"
        style:top="{header.height}px"
        role="navigation"
        bind:clientWidth={sidebar.width}
        transition:fly={{ x: -10, duration: 300 }}
    >
        <nav class="min-w-fit space-y-10">
            {@render group([
                { icon: "/icons/navigation/Home.svg", text: "Home", url: "/" },
                {
                    icon: "/icons/navigation/Account.svg",
                    text: "Account",
                    url: `/${session.user._id}`,
                },
            ])}

            {@render group(
                [
                    {
                        icon: "/icons/navigation/Stars.svg",
                        text: Wording.favorites,
                        url: `/my/${MyPageType.favorites}`,
                    },
                    {
                        icon: "/icons/navigation/Folder.svg",
                        text: Wording.folders,
                        url: `/my/${MyPageType.folders}`,
                    },
                    {
                        icon: "/icons/navigation/Document.svg",
                        text: Wording.sets,
                        url: `/my/${MyPageType.sets}`,
                    },
                ],
                "Your library"
            )}

            {@render group(
                [
                    {
                        icon: "/icons/navigation/FolderPlus.svg",
                        text: Wording.folder,
                        url: "/create/folder",
                    },
                    {
                        icon: "/icons/navigation/DocumentPlus.svg",
                        text: Wording.set,
                        url: "/create/set",
                    },
                ],
                "Create"
            )}
        </nav>
    </div>
{/if}

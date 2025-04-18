<script lang="ts">
    import determineWording from "$lib/utils/determineWording";
    import { getContext } from "svelte";
    import { fly } from "svelte/transition";

    let { isInitialLoad, isMobile }: { isInitialLoad: boolean; isMobile: boolean } = $props();

    const headerHeight: { size: number } = getContext("headerHeight");
    const sidebarVisible: { visible: boolean } = getContext("sidebarVisible");
    let windowHeight: number = $state.raw(0);
    let focusedOnSidebar: boolean = $state.raw(false);
</script>

<svelte:window
    bind:innerHeight={windowHeight}
    onclick={(event: MouseEvent) => {
        if (
            (event.target as HTMLElement)?.id === "sidebarToggle" ||
            focusedOnSidebar ||
            !sidebarVisible.visible ||
            !isMobile
        )
            return;

        focusedOnSidebar = false;
        sidebarVisible.visible = false;
    }}
/>

{#snippet group(links: { url: string; text: string; icon: string }[], name?: string)}
    <div>
        {#if name}
            <p class="text-light mb-2 pl-3 text-nowrap">{name}</p>
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

<div
    class="bg-primary fixed left-0 z-30 flex h-full min-w-fit flex-col justify-between gap-10 overflow-x-hidden overflow-y-auto py-5.5 pr-16 pl-4 shadow-2xl md:static md:py-7 md:pr-4 md:pl-7 md:shadow-none xl:w-[17.5%] 2xl:w-[15%] {isInitialLoad
        ? 'pointer-events-none opacity-0'
        : ''}"
    style:height="{windowHeight - headerHeight.size}px"
    style:top="{headerHeight.size}px"
    in:fly={{ x: -10 }}
    out:fly={{ x: -10 }}
    onmouseenter={() => (focusedOnSidebar = true)}
    onmouseleave={() => (focusedOnSidebar = false)}
    role="navigation"
>
    <nav class="min-w-fit space-y-10">
        {@render group([
            { icon: "/icons/navigation/Home.svg", text: "Home", url: "/" },
            { icon: "/icons/navigation/Account.svg", text: "Account", url: "/user" },
        ])}

        {@render group(
            [
                {
                    icon: "/icons/navigation/Stars.svg",
                    text: determineWording("favorites"),
                    url: "/my/favorites",
                },
                {
                    icon: "/icons/navigation/Folder.svg",
                    text: determineWording("folders"),
                    url: "/my/folders",
                },
                {
                    icon: "/icons/navigation/Document.svg",
                    text: determineWording("sets"),
                    url: "/my/sets",
                },
            ],
            "Your library"
        )}

        {@render group(
            [
                {
                    icon: "/icons/navigation/FolderPlus.svg",
                    text: determineWording("folder"),
                    url: "/create/folder",
                },
                {
                    icon: "/icons/navigation/DocumentPlus.svg",
                    text: determineWording("set"),
                    url: "/create/set",
                },
            ],
            "Create a new"
        )}
    </nav>

    <p class="text-dark pl-3 text-sm">Made for Savannah ❤️</p>
</div>

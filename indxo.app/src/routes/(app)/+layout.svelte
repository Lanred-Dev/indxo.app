<script lang="ts">
    import { afterNavigate, beforeNavigate } from "$app/navigation";
    import { setContext } from "svelte";
    import { fade } from "svelte/transition";
    import Loader from "$lib/components/Icons/Loader.svelte";
    import { browser } from "$app/environment";
    import Header from "./Header.svelte";
    import { MediaQuery } from "svelte/reactivity";
    import Sidebar from "./Sidebar.svelte";
    import type {
        HeaderContext,
        SessionContext,
        SidebarContext,
        ViewportContext,
    } from "$lib/utils/global";

    let { data, children } = $props();

    setContext("session", {
        session: data.session,
        user: data.user,
    } satisfies SessionContext);

    let headerHeight: number = $state.raw(0);
    setContext("header", {
        get height() {
            return headerHeight;
        },
        set height(newValue) {
            headerHeight = newValue;
        },
    } satisfies HeaderContext);

    let sidebarWidth: number = $state.raw(0);
    let isSidebarVisible: boolean = $state.raw(false);
    setContext("sidebar", {
        get isVisible() {
            return isSidebarVisible;
        },
        set isVisible(newValue) {
            isSidebarVisible = newValue;
        },
        get width() {
            return sidebarWidth;
        },
        set width(newValue) {
            sidebarWidth = newValue;
        },
    } satisfies SidebarContext);

    let Viewport: ViewportContext["Content"] = $state.raw(undefined);
    let viewportScrollY: number = $state.raw(0);
    let isNavigating: boolean = $state.raw(false);
    // 768px is the same sizing used for md: in tailwind
    const isMobile: MediaQuery = new MediaQuery("(max-width: 768px)", true);
    setContext("viewport", {
        get scrollY() {
            return viewportScrollY;
        },
        get isMobile() {
            return isMobile.current;
        },
        get isNavigating() {
            return isNavigating;
        },
        get Content() {
            return Viewport ?? (document.querySelector("main") as HTMLDivElement) ?? undefined;
        },
    } satisfies ViewportContext);

    beforeNavigate(() => {
        isNavigating = true;

        if (isMobile.current) isSidebarVisible = false;
    });

    afterNavigate(() => {
        isNavigating = false;

        if (Viewport) Viewport.scrollTop = 0;
    });

    $effect(() => {
        isSidebarVisible = !isMobile.current;
    });
</script>

<!--This prevents animated layout shifts from happening during first page load-->
{#if !browser}
    <style>
        * {
            transition: none !important;
        }
    </style>
{/if}

<Header />

<Sidebar />

{#if isNavigating}
    <div
        class="x-center y-center z-40 h-full w-full"
        style:padding-top="{headerHeight}px"
        style:padding-left="{!isMobile.current && isSidebarVisible ? sidebarWidth : 0}px"
        transition:fade
    >
        <Loader class="x-center y-center" />
    </div>
{/if}

<main
    class={[
        "relative h-dvh w-full overflow-x-hidden overflow-y-auto pr-7 pb-6 transition-[padding-left,padding-right,padding-top,padding-bottom,opacity] duration-400 ease-in-out md:pr-22 xl:pr-[15%]",
        isMobile.current && isSidebarVisible && "pointer-events-none blur-xs",
    ]}
    bind:this={Viewport}
    onscroll={() => {
        viewportScrollY = Viewport?.scrollTop ?? 0;
    }}
    style:--header-height="{headerHeight}px"
    style:--sidebar-width="{!isMobile.current && isSidebarVisible ? sidebarWidth : 0}px"
    style:opacity="{isNavigating ? 0 : 100}%"
>
    {@render children?.()}
</main>

<style lang="postcss">
    main {
        --padding-top: calc(var(--spacing) * 12);
        --padding-left: calc(var(--spacing) * 7);
        padding-top: calc(var(--padding-top) + var(--header-height));
        padding-left: calc(var(--padding-left) + var(--sidebar-width));

        @media (width >= 48rem) {
            --padding-top: calc(var(--spacing) * 16);
            --padding-left: 10%;
        }

        @media (width >= 64rem) {
            --padding-top: calc(var(--spacing) * 24);
        }
    }
</style>

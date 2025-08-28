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
    let isSidebarVisibile: boolean = $state.raw(false);
    setContext("sidebar", {
        get isVisible() {
            return isSidebarVisibile;
        },
        set isVisible(newValue) {
            isSidebarVisibile = newValue;
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
    let isLoading: boolean = $state.raw(false);
    // NOTE: 768px is the same sizing used for md: in tailwind
    const isMobile = new MediaQuery("(max-width: 768px)", true);
    setContext("viewport", {
        get scrollY() {
            return viewportScrollY;
        },
        get isMobile() {
            return isMobile.current;
        },
        get isLoading() {
            return isLoading;
        },
        get Content() {
            return Viewport ?? (document.querySelector("main") as HTMLDivElement) ?? undefined;
        },
    } satisfies ViewportContext);

    beforeNavigate(() => {
        isLoading = true;
        if (isMobile.current) isSidebarVisibile = false;
    });

    afterNavigate(() => {
        isLoading = false;
        if (Viewport) Viewport.scrollTop = 0;
    });

    $effect(() => {
        isSidebarVisibile = !isMobile.current;
    });
</script>

<!--(`!browser` acts as intial load indicator) Prevent animated layout shifts from happening during first page load-->
{#if !browser}
    <style>
        * {
            transition: none !important;
        }
    </style>
{/if}

<Header />

{#if data.session}
    <Sidebar />
{/if}

{#if isLoading}
    <div
        class="x-center y-center z-40 h-full w-full"
        style:padding-top="{headerHeight}px"
        style:padding-left="{isMobile.current || !isSidebarVisibile ? 0 : sidebarWidth}px"
        transition:fade
    >
        <div class="bg-page h-full w-full">
            <Loader class="x-center y-center" />
        </div>
    </div>
{/if}

<main
    class={[
        "relative h-screen w-full overflow-y-auto pr-7 pb-6 transition-[padding-left,padding-right,padding-top,padding-bottom] duration-400 ease-in-out md:pr-22 xl:pr-[15%]",
        isMobile.current && isSidebarVisibile && "pointer-events-none blur-xs",
    ]}
    bind:this={Viewport}
    onscroll={() => {
        viewportScrollY = Viewport?.scrollTop ?? 0;
    }}
    style:--header-height="{headerHeight}px"
    style:--sidebar-width="{!isMobile.current && isSidebarVisibile ? sidebarWidth : 0}px"
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

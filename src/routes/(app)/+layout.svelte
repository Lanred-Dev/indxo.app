<script lang="ts">
    import Header from "./Header.svelte";
    import Sidebar from "./Sidebar.svelte";
    import { afterNavigate, beforeNavigate } from "$app/navigation";
    import { onMount, setContext } from "svelte";
    import { fade } from "svelte/transition";
    import Loader from "$lib/components/Loader.svelte";

    let { data, children } = $props();

    const sidebarVisible: { visible: boolean } = $state({ visible: true });
    const headerHeight: { size: 0 } = $state({ size: 0 });
    let isMobile: boolean = $state.raw(false);
    let isLoading: boolean = $state.raw(false);
    // `isInitialLoad` is used so that the sidebar isnt rendered until after checkIfMobile is called. Prevents a flash of the sidebar on mobile devices.
    let isInitialLoad: boolean = $state.raw(true);
    let viewport: HTMLElement;

    setContext("session", data.session);
    setContext("user", data.user);
    setContext("sidebarVisible", sidebarVisible);
    setContext("headerHeight", headerHeight);

    beforeNavigate(() => {
        isLoading = true;

        if (isMobile) sidebarVisible.visible = false;
    });

    afterNavigate(() => {
        isLoading = false;
        viewport.scrollTop = 0;
    });

    /**
     * Checks if the window is mobile or not.
     *
     * @returns never
     */
    function checkIfMobile() {
        if (window.innerWidth <= 786 && !isMobile) {
            isMobile = true;
            sidebarVisible.visible = false;
        } else if (window.innerWidth > 786 && isMobile) {
            isMobile = false;
            sidebarVisible.visible = true;
        }
    }

    onMount(() => {
        isInitialLoad = false;
        checkIfMobile();
    });
</script>

<svelte:window on:resize={checkIfMobile} />

<div class="flex h-screen max-h-screen w-full flex-col overflow-hidden">
    <Header />

    <div
        class="relative flex w-full grow overflow-hidden"
        style:padding-top="{headerHeight.size}px"
    >
        {#if data.session && sidebarVisible.visible}
            <Sidebar {isInitialLoad} {isMobile} />
        {/if}

        <div class="relative h-full w-full">
            {#if isLoading}
                <div class="x-center y-center bg-primary z-40 flex h-full w-full" in:fade out:fade>
                    <div class="x-center y-center">
                        <Loader />
                    </div>
                </div>
            {/if}

            <main
                class="relative flex h-full w-full flex-col items-start justify-start overflow-x-hidden px-7 pt-12 pb-6 transition-[filter] duration-500 md:px-16 md:pt-16 md:pr-[22.5%] md:pl-[10%] lg:pt-24 2xl:pr-[28%] {sidebarVisible.visible &&
                isMobile
                    ? 'pointer-events-none blur-xs'
                    : ''}"
                bind:this={viewport}
            >
                {@render children?.()}
            </main>
        </div>
    </div>
</div>

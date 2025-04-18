<script lang="ts">
    import Header from "./Header.svelte";
    import Sidebar from "./Sidebar.svelte";
    import { afterNavigate, beforeNavigate } from "$app/navigation";
    import { onMount, setContext } from "svelte";
    import { fade } from "svelte/transition";

    let { data, children } = $props();

    const sidebarVisible: { visible: boolean } = $state({ visible: true });
    const headerHeight: { size: 0 } = $state({ size: 0 });
    let isMobile: boolean = $state.raw(false);
    let isLoading: boolean = $state.raw(false);
    // Used so that the sidebar isnt rendered until after checkIfMobile is called. Prevents a flash of the sidebar on mobile devices.
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
                        <svg class="loader size-12" viewBox="25 25 50 50">
                            <circle
                                class="stroke-accent-light fill-none stroke-2"
                                cx="50"
                                cy="50"
                                r="20"
                            />
                        </svg>
                    </div>
                </div>

                <style>
                    .loader {
                        animation: rotate 2s linear infinite;
                    }

                    .loader circle {
                        stroke-dasharray: 150, 200;
                        stroke-dashoffset: -10;
                        animation: dash 1.5s ease-in-out infinite;
                        stroke-linecap: round;
                    }

                    @keyframes rotate {
                        100% {
                            transform: rotate(360deg);
                        }
                    }

                    @keyframes dash {
                        0% {
                            stroke-dasharray: 1, 200;
                            stroke-dashoffset: 0;
                        }

                        50% {
                            stroke-dasharray: 89, 200;
                            stroke-dashoffset: -35;
                        }

                        100% {
                            stroke-dasharray: 89, 200;
                            stroke-dashoffset: -124;
                        }
                    }
                </style>
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

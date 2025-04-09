<script lang="ts">
    import Header from "./Header.svelte";
    import Sidebar from "./Sidebar.svelte";
    import { afterNavigate, beforeNavigate } from "$app/navigation";
    import { setContext } from "svelte";
    import { fade } from "svelte/transition";

    let { data, children } = $props();

    const sidebarVisible: { visible: boolean } = $state({ visible: true });
    let windowWidth: number = $state.raw(Infinity);
    let isMobile: boolean = false;
    let isLoading: boolean = $state.raw(false);

    setContext("session", data.session);
    setContext("user", data.user);
    setContext("sidebarVisible", sidebarVisible);

    beforeNavigate(() => {
        isLoading = true;
    });

    afterNavigate(() => {
        isLoading = false;
    });

    $effect(() => {
        if (windowWidth <= 786 && !isMobile) {
            isMobile = true;
            sidebarVisible.visible = false;
        } else if (windowWidth > 786 && isMobile) {
            isMobile = false;
            sidebarVisible.visible = true;
        }
    });
</script>

<svelte:window bind:innerWidth={windowWidth} />

<div class="flex h-screen max-h-screen w-full flex-col overflow-hidden">
    <Header />

    <div class="flex max-h-full w-full flex-grow overflow-hidden">
        {#if data.session}
            <Sidebar />
        {/if}

        <main
            class="md:px-18 relative flex h-full w-full flex-col items-start justify-start overflow-x-hidden px-7 pb-6 pt-12 md:pl-[10%] md:pr-[22.5%] md:pt-16 lg:pt-24 2xl:pr-[28%] {isLoading
                ? 'overflow-y-hidden'
                : 'overflow-y-auto'}"
        >
            {#if isLoading}
                <div
                    class="x-center y-center z-[100] flex h-full w-full items-center justify-center bg-primary"
                    in:fade={{ duration: 200 }}
                    out:fade={{ duration: 200 }}
                >
                    <div class="x-center y-center">
                        <svg class="size-20" id="loader" viewBox="25 25 50 50">
                            <circle
                                class="stroke-accent-light fill-none stroke-2"
                                cx="50"
                                cy="50"
                                r="20"
                            />
                        </svg>
                    </div>
                </div>

                <style lang="postcss">
                    #loader {
                        animation: rotate 2s linear infinite;
                    }

                    #loader circle {
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

            {@render children?.()}
        </main>
    </div>
</div>

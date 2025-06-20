<script module lang="ts">
    export type SizesContext = {
        header: number;
        sidebar: number;
        isMobile: MediaQuery;
    };

    export type SidebarVisiblityContext = () => {
        isVisible: boolean;
        setVisible: (isVisible: boolean) => void;
    };

    export type SessionContext = {
        session: Session | null;
        user: SessionUser;
    };
</script>

<script lang="ts">
    import { afterNavigate, beforeNavigate } from "$app/navigation";
    import { setContext } from "svelte";
    import { fade } from "svelte/transition";
    import Loader from "$lib/components/Loader.svelte";
    import { browser } from "$app/environment";
    import Header from "./Header.svelte";
    import { MediaQuery } from "svelte/reactivity";
    import type { Session, SessionUser } from "$lib/documents";
    import Sidebar from "./Sidebar.svelte";
    import { innerWidth } from "svelte/reactivity/window";

    let { data, children } = $props();

    setContext("session", {
        session: data.session,
        user: data.user,
    });
    const isMobile = new MediaQuery("(max-width: 768px)", true);
    const sizes: SizesContext = $state({ header: 0, sidebar: 0, isMobile });
    setContext("sizes", sizes);
    let sidebarVisibility = $state(false);
    setContext("sidebarVisibility", (() => {
        return {
            isVisible: sidebarVisibility,
            setVisible: (isVisible: boolean) => (sidebarVisibility = isVisible),
        };
    }) satisfies SidebarVisiblityContext);

    let viewport: HTMLElement;
    let isLoading: boolean = $state.raw(false);

    beforeNavigate(() => {
        isLoading = true;

        if (isMobile.current) sidebarVisibility = false;
    });

    afterNavigate(() => {
        isLoading = false;
        viewport.scrollTop = 0;
    });

    $effect(() => {
        sidebarVisibility = !isMobile.current;
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

<div class="h-screen max-h-screen w-full overflow-hidden">
    <Header />

    {#if data.session}
        <Sidebar />
    {/if}

    <div
        class="relative h-full w-full grow overflow-hidden transition-[padding-left] duration-400"
        style:padding-top="{sizes.header}px"
        style:padding-left="{isMobile.current || !sidebarVisibility ? 0 : sizes.sidebar}px"
    >
        <div
            class={[
                "relative h-full w-full transition-[padding-left,padding-right,filter] duration-400",
                isMobile.current && sidebarVisibility && "pointer-events-none blur-xs",
            ]}
            style:padding-left={!isMobile.current && !sidebarVisibility ? "5%" : "0"}
            style:padding-right={!isMobile.current && !sidebarVisibility ? "10%" : "0"}
        >
            {#if isLoading}
                <div class="x-center y-center bg-page z-40 h-full w-full" transition:fade>
                    <Loader class="x-center y-center" />
                </div>
            {/if}

            <main
                class="relative h-full w-full overflow-y-auto px-7 pt-12 pb-6 md:px-16 md:pt-16 md:pr-[22.5%] md:pl-[10%] lg:pt-24 2xl:pr-[28%]"
                bind:this={viewport}
            >
                {@render children?.()}
            </main>
        </div>
    </div>
</div>

<script lang="ts">
    import { beforeNavigate } from "$app/navigation";
    import { getContext, setContext, type Snippet } from "svelte";
    import { popupContextKey, type PopupContext } from ".";
    import type { ViewportContext } from "$lib/utils/global";
    import { browser } from "$app/environment";

    let {
        isVisible = $bindable(false),
        children,
    }: {
        isVisible?: boolean;
        children: Snippet<[]>;
    } = $props();

    const viewport: ViewportContext = getContext("viewport");
    // `scrollY` is used to keep track of the scroll position of the main content area
    let scrollY: number = $state(0);
    let openingTrigger: HTMLElement | undefined = $state.raw();
    let isInViewport: boolean = $derived(
        openingTrigger ? viewport.content!.contains(openingTrigger) : false
    );
    let body: HTMLElement;
    let main: HTMLElement | undefined = $derived.by(() => {
        if (!browser) return undefined;

        return isInViewport ? viewport.content! : body;
    });

    setContext(popupContextKey, {
        get isInViewport() {
            return isInViewport;
        },
        get scrollY() {
            return scrollY;
        },
        get isVisible() {
            return isVisible;
        },
        get openingTrigger() {
            return openingTrigger;
        },
        setVisible(newValue: boolean, trigger?: HTMLElement) {
            if (newValue === isVisible) return;

            isVisible = newValue;
            if (trigger) openingTrigger = trigger;
        },
    } satisfies PopupContext);

    /**
     * Gets the `scrollTop` of the current main element.
     */
    function getScrollY() {
        scrollY = main!.scrollTop;
    }

    beforeNavigate(() => {
        isVisible = false;
    });

    $effect(() => {
        if (!main) return;

        getScrollY();
        main.addEventListener("scroll", getScrollY);

        return () => {
            main.removeEventListener("scroll", getScrollY);
        };
    });
</script>

<svelte:body bind:this={body} />

{@render children()}

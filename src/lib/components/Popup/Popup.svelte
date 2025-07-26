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
    let scrollY: number = $state.raw(0);
    let OpeningTrigger: HTMLElement | undefined = $state.raw();
    let isInViewport: boolean = $derived(
        OpeningTrigger ? viewport.Content!.contains(OpeningTrigger) : false
    );
    let body: HTMLElement;
    let main: HTMLElement | undefined = $derived.by(() => {
        if (!browser) return undefined;

        return isInViewport ? viewport.Content! : body;
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
        get OpeningTrigger() {
            return OpeningTrigger;
        },
        setVisible(newValue, trigger) {
            if (newValue === isVisible) return;

            isVisible = newValue;
            if (trigger) OpeningTrigger = trigger;
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
        if (isInViewport) {
            scrollY = viewport.scrollY;
        } else if (main) {
            getScrollY();
            main.addEventListener("scroll", getScrollY);

            return () => {
                main.removeEventListener("scroll", getScrollY);
            };
        }
    });
</script>

<svelte:body bind:this={body} />

{@render children()}

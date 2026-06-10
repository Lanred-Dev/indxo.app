<script lang="ts">
    import { beforeNavigate } from "$app/navigation";
    import { getContext, setContext, type Snippet, onMount } from "svelte";
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
    let ScrollingContainer: HTMLElement;

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

    function getScrollY() {
        scrollY = ScrollingContainer.scrollTop;
    }

    beforeNavigate(() => {
        isVisible = false;
    });

    onMount(() => {
        ScrollingContainer = isInViewport ? viewport.Content! : document.body;
        getScrollY();
        ScrollingContainer.addEventListener("scroll", getScrollY);

        return () => {
            ScrollingContainer.removeEventListener("scroll", getScrollY);
        };
    });
</script>

{@render children()}

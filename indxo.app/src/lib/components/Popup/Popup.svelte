<script lang="ts">
    import { beforeNavigate } from "$app/navigation";
    import { getContext, setContext, type Snippet, onMount } from "svelte";
    import {
        popupContextKey,
        type PopupContext,
        setCurrentDismissalMethod,
        dismissCurrentPopup,
    } from ".";
    import type { ViewportContext } from "$lib/utils/global";

    let {
        isVisible = $bindable(false),
        allowLightDismiss = true,
        children,
    }: {
        isVisible?: boolean;
        allowLightDismiss?: boolean;
        children: Snippet<[]>;
    } = $props();

    const viewport: ViewportContext = getContext("viewport");
    let scrollY: number = $state.raw(0); // Used to keep track of the scroll position of the scrolling container
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
        setVisible,
    } satisfies PopupContext);

    function setVisible(newValue: boolean, trigger?: HTMLElement) {
        if (newValue === isVisible) return;

        isVisible = newValue;

        if (trigger) OpeningTrigger = trigger;

        if (isVisible) {
            if (dismissCurrentPopup && dismissCurrentPopup !== handleLightDismiss)
                dismissCurrentPopup();

            setCurrentDismissalMethod(handleLightDismiss);
        } else {
            setCurrentDismissalMethod(undefined);
        }
    }

    function handleLightDismiss() {
        setVisible(false);
    }

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

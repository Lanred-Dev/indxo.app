<script lang="ts">
    import { beforeNavigate } from "$app/navigation";
    import { getContext, onDestroy, setContext, type Snippet } from "svelte";
    import { popupContextKey, type PopupContext } from ".";
    import type { ViewportContext } from "$lib/utils/global";

    let {
        isVisible = $bindable(false),
        children,
    }: {
        isVisible?: boolean;
        children: Snippet<[]>;
    } = $props();

    const viewport: ViewportContext = getContext("viewport");
    let trigger: HTMLButtonElement | HTMLInputElement | null = $state.raw(null);
    let isInViewport: boolean = $state.raw(false);
    // `scrollY` is used to keep track of the scroll position of the main content area
    let scrollY: number = $state(0);

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
        set isVisible(newValue: boolean) {
            isVisible = newValue;
        },
        get trigger() {
            return trigger;
        },
        set trigger(newValue: HTMLButtonElement | HTMLInputElement | null) {
            if (!newValue) return;

            trigger = newValue;

            switch (trigger?.tagName.toLowerCase()) {
                case "button":
                    trigger.addEventListener("click", () => (isVisible = !isVisible));
                    break;
                case "input":
                    trigger.addEventListener("focusin", () => (isVisible = true));
                    trigger.addEventListener("keydown", () => (isVisible = true));
                    break;
            }

            isInViewport = viewport.content!.contains(trigger);

            const main: HTMLElement = isInViewport ? viewport.content! : document.body;
            scrollY = main.scrollTop;
            main.addEventListener("scroll", () => {
                scrollY = main.scrollTop;
            });
        },
    } satisfies PopupContext);

    beforeNavigate(() => (isVisible = false));

    onDestroy(() => {
        if (trigger) {
            trigger?.removeEventListener("click", () => {
                isVisible = !isVisible;
            });
            trigger?.removeEventListener("focusin", () => {
                isVisible = true;
            });
            trigger?.removeEventListener("keydown", () => {
                isVisible = true;
            });

            const main: HTMLElement = isInViewport ? viewport.content! : document.body;
            main.removeEventListener("scroll", () => {
                scrollY = main.scrollTop;
            });
        }
    });
</script>

{@render children()}

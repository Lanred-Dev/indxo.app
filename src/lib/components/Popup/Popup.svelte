<script lang="ts">
    import { beforeNavigate } from "$app/navigation";
    import { onDestroy, setContext, type Snippet } from "svelte";
    import { popupContextKey, type PopupContext } from ".";

    let {
        visible = $bindable(false),
        children,
    }: {
        visible?: boolean;
        children: Snippet<[]>;
    } = $props();

    let trigger: HTMLButtonElement | HTMLInputElement | null = $state.raw(null);
    let isInViewport: boolean = $state.raw(false);
    // `scrollY` is used to keep track of the scroll position of the main content area
    let scrollY: number = $state.raw(0);

    setContext(popupContextKey, (() => {
        return {
            isInViewport,
            scrollY,
            isVisible: visible,
            setVisible: (isVisible: boolean) => (visible = isVisible),
            trigger,
            setTrigger: (newTrigger: HTMLButtonElement | HTMLInputElement) => {
                trigger = newTrigger;

                switch (trigger?.tagName.toLowerCase()) {
                    case "button":
                        trigger.addEventListener("click", () => (visible = !visible));
                        break;
                    case "input":
                        trigger.addEventListener("focusin", () => (visible = true));
                        trigger.addEventListener("keydown", () => (visible = true));
                        break;
                }

                const main: HTMLElement = document.querySelector("main")!;

                if (main.contains(trigger)) {
                    isInViewport = true;
                    scrollY = main.scrollTop;
                    main.addEventListener("scroll", () => (scrollY = main.scrollTop));
                } else {
                    scrollY = window.scrollY;
                    document.body.addEventListener("scroll", () => (scrollY = window.scrollY));
                }
            },
        };
    }) satisfies PopupContext);

    beforeNavigate(() => (visible = false));

    onDestroy(() => {
        if (trigger) {
            trigger?.removeEventListener("click", () => (visible = !visible));
            trigger?.removeEventListener("focusin", () => (visible = true));
            trigger?.removeEventListener("keydown", () => (visible = true));

            if (isInViewport) {
                const main: HTMLElement = document.querySelector("main")!;
                main.removeEventListener("scroll", () => (scrollY = main.scrollTop));
            } else {
                document.body.addEventListener("scroll", () => (scrollY = window.scrollY));
            }
        }
    });
</script>

{@render children()}

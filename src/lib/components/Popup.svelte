<script lang="ts">
    import { beforeNavigate } from "$app/navigation";
    import { getContext, onMount, type Snippet } from "svelte";
    import { fade, fly } from "svelte/transition";
    import { twMerge } from "tailwind-merge";
    import type { SizesContext } from "../../routes/(app)/+layout.svelte";

    const OFFSET: number = 2.5;

    let {
        visible = $bindable(false),
        canShow = $bindable(true),
        alignment = "left",
        id,
        classes,
        children,
    }: {
        visible?: boolean;
        canShow?: boolean;
        alignment?: "left" | "right" | "center";
        id: string;
        classes?: string;
        children: Snippet<[]>;
    } = $props();

    const sizes: SizesContext = getContext("sizes");

    let button: HTMLButtonElement | HTMLInputElement | null = $state.raw(null);
    let popup: HTMLElement | null = $state.raw(null);
    let buttonIsInDocument: boolean = true;
    // `scrollY` is used to keep track of the scroll position of the main content area
    let scrollY: number = $state.raw(0);
    let position: { x: number; y: number } = $derived.by(() => {
        const position: { x: number; y: number } = {
            x: 0,
            y: 0,
        };

        if (!button || !popup) return position;

        const buttonBounding: DOMRect = button.getBoundingClientRect();
        const buttonPosition: { x: number; y: number } = {
            x: buttonBounding.left + window.scrollX,
            y: buttonBounding.bottom + window.scrollY,
        };

        position.y = buttonPosition.y - scrollY;

        switch (alignment) {
            case "left":
                position.x = buttonPosition.x;
                break;
            case "right":
                position.x = buttonPosition.x + buttonBounding.width - popup.clientWidth;
                break;
            case "center":
                position.x = buttonPosition.x + buttonBounding.width / 2 - popup.clientWidth / 2;
                break;
        }

        // Make sure the popup is within the window bounds
        if (buttonPosition.x + popup.clientWidth > sizes.window.width) {
            position.x = buttonPosition.x - popup.clientWidth + buttonBounding.width;
        } else if (buttonPosition.x < 0) {
            position.x = buttonPosition.x + buttonBounding.width;
        }

        if (buttonPosition.y + OFFSET > sizes.window.height) {
            position.y = buttonPosition.y - popup.clientHeight - OFFSET;
        } else {
            position.y = buttonPosition.y + OFFSET;
        }

        if (position.y < sizes.header && buttonIsInDocument) {
            position.y = sizes.header + OFFSET;
        }

        return position;
    });

    beforeNavigate(() => (visible = false));

    onMount(() => {
        button = document.getElementById(id) as HTMLButtonElement | HTMLInputElement;
        const buttonTag: string = button?.tagName.toLowerCase() ?? "";

        switch (buttonTag) {
            case "button":
                button.addEventListener("click", () => (visible = !visible));
                break;
            case "input":
                button.addEventListener("focusin", () => (visible = true));
                break;
            default:
                return;
        }

        const main: HTMLElement = document.querySelector("main")!;
        buttonIsInDocument = main.contains(button);

        if (buttonIsInDocument) {
            scrollY = main.scrollTop;
            main.addEventListener("scroll", () => (scrollY = main.scrollTop));
        }

        return () => {
            switch (buttonTag) {
                case "button":
                    button?.removeEventListener("click", () => (visible = !visible));
                    break;
                case "input":
                    button?.removeEventListener("focusin", () => (visible = true));
                    break;
                default:
                    return;
            }

            if (buttonIsInDocument)
                main.removeEventListener("scroll", () => (scrollY = main.scrollTop));
        };
    });
</script>

<svelte:window
    onclick={(event: MouseEvent) => {
        if (
            !visible ||
            event.target === button ||
            (event.target as HTMLElement)?.closest(`#${button?.id}`) ||
            popup?.contains(event.target as Node)
        )
            return;

        visible = false;
    }}
/>

{#if visible && canShow}
    <div
        class={twMerge("container-primary bg-primary! fixed z-50 shadow-lg", classes)}
        style:pointer-events={visible ? "auto" : "none"}
        style:left="{position.x}px"
        style:top="{position.y}px"
        in:fly={{ y: 10, duration: 100 }}
        out:fade={{ duration: 100 }}
        bind:this={popup}
    >
        {@render children?.()}
    </div>
{/if}

<script lang="ts">
    import { onMount, type Snippet } from "svelte";
    import { fade, fly } from "svelte/transition";
    import { twMerge } from "tailwind-merge";

    const OFFSET: number = 2.5;

    let {
        visible = $bindable(false),
        alignment = "left",
        buttonID,
        classes,
        children,
    }: {
        visible?: boolean;
        alignment?: "left" | "right" | "center";
        buttonID: string;
        classes?: string;
        children: Snippet<[]>;
    } = $props();
    let button: HTMLButtonElement | HTMLInputElement | null = $state.raw(null);
    let popup: HTMLElement | null = $state.raw(null);
    let windowWidth: number = $state.raw(0);
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
        if (buttonPosition.x + popup.clientWidth > window.innerWidth) {
            position.x = buttonPosition.x - popup.clientWidth + buttonBounding.width;
        } else if (buttonPosition.x < 0) {
            position.x = buttonPosition.x + buttonBounding.width;
        }

        if (buttonPosition.y + OFFSET > window.innerHeight) {
            position.y = buttonPosition.y - popup.clientHeight - OFFSET;
        } else {
            position.y = buttonPosition.y + OFFSET;
        }

        return position;
    });

    onMount(() => {
        button = document.getElementById(buttonID) as HTMLButtonElement | HTMLInputElement;

        if (button?.tagName === "BUTTON") {
            button.addEventListener("click", () => (visible = !visible));
        } else if (button?.tagName === "INPUT") {
            button.addEventListener("focusin", () => (visible = true));
        }

        return () => {
            if (button?.tagName === "BUTTON") {
                button.removeEventListener("click", () => (visible = !visible));
            } else if (button?.tagName === "INPUT") {
                button.removeEventListener("focusin", () => (visible = true));
            }
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
    bind:innerWidth={windowWidth}
/>

{#if visible}
    <div
        class={twMerge("container-popup fixed", classes)}
        style:pointer-events={visible ? "auto" : "none"}
        style:left="{position.x}px"
        style:top="{position.y}px"
        in:fly={{ y: 10, duration: 100 }}
        out:fade={{ duration: 50 }}
        bind:this={popup}
    >
        {@render children?.()}
    </div>
{/if}

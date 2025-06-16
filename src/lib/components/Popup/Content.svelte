<script lang="ts">
    import { fade, fly } from "svelte/transition";
    import { PopupAlignment, popupContextKey, type PopupContext } from ".";
    import { innerHeight, innerWidth } from "svelte/reactivity/window";
    import { getContext, type Snippet } from "svelte";
    import type { SizesContext } from "../../../routes/(app)/+layout.svelte";

    let {
        alignment = PopupAlignment.center,
        offset = 2.5,
        children,
        ...properties
    }: {
        alignment?: PopupAlignment;
        offset?: number;
        children: Snippet<[]>;
        [key: string]: any;
    } = $props();

    const sizes: SizesContext = getContext("sizes");
    const popupContext: PopupContext = getContext(popupContextKey);
    let content: HTMLDivElement | null = $state.raw(null);
    let position: { x: number; y: number } = $derived.by(() => {
        const position: { x: number; y: number } = {
            x: 0,
            y: 0,
        };
        const { trigger, scrollY, isInViewport } = popupContext();

        if (!trigger || !content || !innerHeight.current || !innerWidth.current) return position;

        const buttonBounding: DOMRect = trigger.getBoundingClientRect();
        const buttonPosition: { x: number; y: number } = {
            x: buttonBounding.left + window.scrollX,
            y: buttonBounding.bottom + scrollY,
        };

        position.y = buttonPosition.y - scrollY;

        switch (alignment) {
            case PopupAlignment.left:
                position.x = buttonPosition.x;
                break;
            case PopupAlignment.right:
                position.x = buttonPosition.x + buttonBounding.width - content.clientWidth;
                break;
            case PopupAlignment.center:
                position.x = buttonPosition.x + buttonBounding.width / 2 - content.clientWidth / 2;
                break;
        }

        // Make sure the popup is within the window bounds
        if (buttonPosition.x + content.clientWidth > innerWidth.current)
            position.x = buttonPosition.x - content.clientWidth + buttonBounding.width;
        if (position.x < 0) position.x = 0 + offset;

        if (buttonPosition.y + offset > innerHeight.current) {
            position.y = buttonPosition.y - content.clientHeight - offset;
        } else {
            position.y = buttonPosition.y + offset;
        }

        if (position.y < sizes.header && isInViewport) position.y = sizes.header + offset;

        return position;
    });
</script>

<svelte:window
    onclick={(event: MouseEvent) => {
        const { trigger, isVisible, setVisible } = popupContext();

        if (isVisible && trigger && !trigger.contains(event.target as Node) && content && content)
            setVisible(false);
    }}
/>

{#if popupContext().isVisible}
    <div
        class={["container-primary fixed z-50 shadow-lg!", properties.class]}
        style:left="{position.x}px"
        style:top="{position.y}px"
        in:fly={{ y: 10, duration: 100 }}
        out:fade={{ duration: 100 }}
        bind:this={content}
    >
        {@render children()}
    </div>
{/if}

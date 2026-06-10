<script lang="ts">
    import { fade, fly } from "svelte/transition";
    import {
        popupContextKey,
        PopupRelativity,
        PopupXAlignment,
        PopupYAlignment,
        type PopupContext,
    } from ".";
    import { innerHeight, innerWidth, scrollY } from "svelte/reactivity/window";
    import { getContext, type Snippet } from "svelte";
    import type { HeaderContext, SidebarContext } from "$lib/utils/global";
    import type { ClassValue } from "svelte/elements";
    import { portal } from "$lib/actions/portal";

    let {
        xAlignment = PopupXAlignment.left,
        yAlignment = PopupYAlignment.bottom,
        positionRelativity = PopupRelativity.trigger,
        offset = 2.5,
        children,
        class: className,
        ...properties
    }: {
        xAlignment?: PopupXAlignment;
        yAlignment?: PopupYAlignment;
        positionRelativity?: PopupRelativity;
        offset?: number;
        children: Snippet<[]>;
        class?: ClassValue;
        [key: string]: any;
    } = $props();

    const header: HeaderContext = getContext("header");
    const sidebar: SidebarContext = getContext("sidebar");
    const popup: PopupContext = getContext(popupContextKey);
    let contentWidth: number = $state.raw(0);
    let contentHeight: number = $state.raw(0);
    let position: { x: number; y: number } = $derived.by(() => {
        popup.scrollY;

        let x: number = 0;
        let y: number = 0;

        if (
            (positionRelativity === PopupRelativity.trigger && !popup.OpeningTrigger) ||
            innerHeight.current === undefined ||
            innerWidth.current === undefined ||
            scrollY.current === undefined
        )
            return { x, y };

        switch (positionRelativity) {
            case PopupRelativity.trigger:
                let triggerBounding = popup.OpeningTrigger!.getBoundingClientRect();

                switch (xAlignment) {
                    case PopupXAlignment.left:
                        x = triggerBounding.left;
                        break;
                    case PopupXAlignment.right:
                        x = triggerBounding.right - contentWidth;
                        break;
                    case PopupXAlignment.center:
                        x = triggerBounding.left + triggerBounding.width - contentWidth / 2;
                        break;
                }

                switch (yAlignment) {
                    case PopupYAlignment.top:
                        y = triggerBounding.top - contentHeight - offset;
                        break;
                    case PopupYAlignment.bottom:
                        y = triggerBounding.bottom + offset;
                        break;
                    case PopupYAlignment.center:
                        y = triggerBounding.top + (triggerBounding.height - contentHeight) / 2;
                        break;
                }

                break;
            case PopupRelativity.page:
                switch (xAlignment) {
                    case PopupXAlignment.left:
                        x = offset;
                        break;
                    case PopupXAlignment.right:
                        x = innerWidth.current - contentWidth - offset;
                        break;
                    case PopupXAlignment.center:
                        x = (innerWidth.current - contentWidth) / 2;
                        break;
                }

                switch (yAlignment) {
                    case PopupYAlignment.top:
                        y = offset;
                        break;
                    case PopupYAlignment.bottom:
                        y = innerHeight.current - (contentHeight + offset);
                        break;
                    case PopupYAlignment.center:
                        y = (innerHeight.current - contentHeight) / 2;
                        break;
                }

                break;
        }

        if (popup.isInViewport && x - offset <= sidebar.width && sidebar.isVisible) {
            x = sidebar.width + offset;
        } else if (x + contentWidth + offset >= innerWidth.current) {
            x = innerWidth.current - contentWidth - offset;
        } else if (x - offset <= 0) {
            x = offset;
        }

        if (popup.isInViewport && y - offset <= header.height) {
            y = header.height + offset;
        } else if (y + contentHeight + offset >= innerHeight.current) {
            y = innerHeight.current - contentHeight - offset;
        } else if (y - offset <= 0) {
            y = offset;
        }

        return { x, y };
    });
</script>

<svelte:window
    onclick={(event) => {
        if (
            popup.isVisible &&
            popup.OpeningTrigger &&
            !popup.OpeningTrigger.contains(event.target as Node)
        )
            popup.setVisible(false);
    }}
/>

{#if popup.isVisible}
    <div
        use:portal
        class={[
            "container-primary fixed z-50 shadow-xl! transition-[opacity,translate]",
            className,
        ]}
        style:left="{position.x}px"
        style:top="{position.y}px"
        style:max-width="calc(100vw - {offset * 2}px)"
        in:fly={{ y: 10, duration: 100 }}
        out:fade={{ duration: 100 }}
        bind:clientWidth={contentWidth}
        bind:clientHeight={contentHeight}
        {...properties}
    >
        {@render children()}
    </div>
{/if}

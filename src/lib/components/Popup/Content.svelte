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
    import { getContext, onMount, type Snippet } from "svelte";
    import type { HeaderContext, SidebarContext } from "$lib/utils/global";
    import type { ClassValue } from "svelte/elements";

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
    let Content: HTMLElement;
    let contentWidth: number = $state.raw(0);
    let contentHeight: number = $state.raw(0);
    let position: { x: number; y: number } = $derived.by(() => {
        popup.scrollY;

        const position: { x: number; y: number } = {
            x: 0,
            y: 0,
        };

        if (
            (positionRelativity === PopupRelativity.trigger && !popup.OpeningTrigger) ||
            innerHeight.current === undefined ||
            innerWidth.current === undefined ||
            scrollY.current === undefined
        )
            return position;

        switch (positionRelativity) {
            case PopupRelativity.trigger:
                let triggerBounding = popup.OpeningTrigger!.getBoundingClientRect();

                switch (xAlignment) {
                    case PopupXAlignment.left:
                        position.x = triggerBounding.left;
                        break;
                    case PopupXAlignment.right:
                        position.x = triggerBounding.right - contentWidth;
                        break;
                    case PopupXAlignment.center:
                        position.x =
                            triggerBounding.left + triggerBounding.width - contentWidth / 2;
                        break;
                }

                switch (yAlignment) {
                    case PopupYAlignment.top:
                        position.y = triggerBounding.top - contentHeight - offset;
                        break;
                    case PopupYAlignment.bottom:
                        position.y = triggerBounding.bottom + offset;
                        break;
                    case PopupYAlignment.center:
                        position.y =
                            triggerBounding.top + (triggerBounding.height - contentHeight) / 2;
                        break;
                }

                break;
            case PopupRelativity.page:
                switch (xAlignment) {
                    case PopupXAlignment.left:
                        position.x = offset;
                        break;
                    case PopupXAlignment.right:
                        position.x = innerWidth.current - contentWidth - offset;
                        break;
                    case PopupXAlignment.center:
                        position.x = (innerWidth.current - contentWidth) / 2;
                        break;
                }

                switch (yAlignment) {
                    case PopupYAlignment.top:
                        position.y = offset;
                        break;
                    case PopupYAlignment.bottom:
                        position.y = innerHeight.current - (contentHeight + offset);
                        break;
                    case PopupYAlignment.center:
                        position.y = (innerHeight.current - contentHeight) / 2;
                        break;
                }

                break;
        }

        if (popup.isInViewport && position.x - offset <= sidebar.width && sidebar.isVisible) {
            position.x = sidebar.width + offset;
        } else if (position.x + contentWidth + offset >= innerWidth.current) {
            position.x = innerWidth.current - contentWidth - offset;
        } else if (position.x - offset <= 0) {
            position.x = offset;
        }

        if (popup.isInViewport && position.y - offset <= header.height) {
            position.y = header.height + offset;
        } else if (position.y + contentHeight + offset >= innerHeight.current) {
            position.y = innerHeight.current - contentHeight - offset;
        } else if (position.y - offset <= 0) {
            position.y = offset;
        }

        return position;
    });

    onMount(() => document.body.appendChild(Content));
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

<div
    class={["container-primary fixed z-50 shadow-xl! transition-[opacity,translate]", className]}
    style:left="{position.x}px"
    style:top="{position.y}px"
    style:opacity="{popup.isVisible ? 100 : 0}%"
    style:translate={popup.isVisible ? undefined : "0px 10px"}
    style:pointer-events={popup.isVisible ? "auto" : "none"}
    in:fly={{ y: 10, duration: 100 }}
    out:fade={{ duration: 100 }}
    bind:clientWidth={contentWidth}
    bind:clientHeight={contentHeight}
    bind:this={Content}
    {...properties}
>
    {@render children()}
</div>

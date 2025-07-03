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

    let {
        xAlignment = PopupXAlignment.left,
        yAlignment = PopupYAlignment.bottom,
        positionRelativity = PopupRelativity.trigger,
        offset = 2.5,
        children,
        ...properties
    }: {
        xAlignment?: PopupXAlignment;
        yAlignment?: PopupYAlignment;
        positionRelativity?: PopupRelativity;
        offset?: number;
        children: Snippet<[]>;
        [key: string]: any;
    } = $props();

    const header: HeaderContext = getContext("header");
    const sidebar: SidebarContext = getContext("sidebar");
    const popup: PopupContext = getContext(popupContextKey);
    let content: HTMLDivElement | null = $state.raw(null);
    let position: { x: number; y: number } = $derived.by(() => {
        popup.scrollY;

        const position: { x: number; y: number } = {
            x: 0,
            y: 0,
        };

        if (
            !popup.openingTrigger ||
            !content ||
            innerHeight.current === undefined ||
            innerWidth.current === undefined ||
            scrollY.current === undefined
        )
            return position;

        switch (positionRelativity) {
            case PopupRelativity.trigger:
                let triggerBounding = popup.openingTrigger.getBoundingClientRect();

                switch (xAlignment) {
                    case PopupXAlignment.left:
                        position.x = triggerBounding.left;
                        break;
                    case PopupXAlignment.right:
                        position.x = triggerBounding.right - content.offsetWidth;
                        break;
                    case PopupXAlignment.center:
                        position.x =
                            triggerBounding.left + triggerBounding.width - content.offsetWidth / 2;
                        break;
                }

                switch (yAlignment) {
                    case PopupYAlignment.top:
                        position.y = triggerBounding.top - content.offsetHeight - offset;
                        break;
                    case PopupYAlignment.bottom:
                        position.y = triggerBounding.bottom + offset;
                        break;
                    case PopupYAlignment.center:
                        position.y =
                            triggerBounding.top +
                            (triggerBounding.height - content.offsetHeight) / 2;
                        break;
                }

                break;
            case PopupRelativity.page:
                switch (xAlignment) {
                    case PopupXAlignment.left:
                        position.x = offset;
                        break;
                    case PopupXAlignment.right:
                        position.x = innerWidth.current - content.offsetWidth - offset;
                        break;
                    case PopupXAlignment.center:
                        position.x = (innerWidth.current - content.offsetWidth) / 2;
                        break;
                }

                switch (yAlignment) {
                    case PopupYAlignment.top:
                        position.y = offset;
                        break;
                    case PopupYAlignment.bottom:
                        position.y = innerHeight.current - content.offsetHeight - offset;
                        break;
                    case PopupYAlignment.center:
                        position.y = (innerHeight.current - content.offsetHeight) / 2;
                        break;
                }

                break;
        }

        if (popup.isInViewport && position.x - offset <= sidebar.width && sidebar.isVisible) {
            position.x = sidebar.width + offset;
        } else if (position.x + content.clientWidth + offset >= innerWidth.current) {
            position.x = innerWidth.current - (content.clientWidth + offset);
        } else if (position.x - offset <= 0) {
            position.x = offset;
        }

        if (popup.isInViewport && position.y - offset <= header.height) {
            position.y = header.height + offset;
        } else if (position.y + content.clientHeight + offset >= innerHeight.current) {
            position.y = innerHeight.current - (content.clientHeight + offset);
        } else if (position.y - offset <= 0) {
            position.y = offset;
        }

        return position;
    });
</script>

<svelte:window
    onclick={(event: MouseEvent) => {
        if (
            popup.isVisible &&
            popup.openingTrigger &&
            !popup.openingTrigger.contains(event.target as Node) &&
            content
        )
            popup.setVisible(false);
    }}
/>

<div
    class={[
        "container-primary fixed z-50 shadow-xl! transition-[opacity,translate]",
        properties.class,
    ]}
    style:left="{position.x}px"
    style:top="{position.y}px"
    style:opacity="{popup.isVisible ? 100 : 0}%"
    style:translate={popup.isVisible ? undefined : "0px 10px"}
    style:pointer-events={popup.isVisible ? "auto" : "none"}
    in:fly={{ y: 10, duration: 100 }}
    out:fade={{ duration: 100 }}
    bind:this={content}
>
    <div></div>
    {@render children()}
</div>
